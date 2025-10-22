import { Business } from "../models/bussiness.model.js";
import BaseError from "../errors/base.error.js";
import BusinessDto from "../dtos/business.dto.js";
import StorageService from "./storage.service.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import MailService from "./mail.service.js";
import TokenService from "./token.service.js";

class BusinessService {
  async login(email, password) {
    if (!email || !password)
      throw BaseError.BadRequestError("Email and password are required");

    const business = await Business.findOne({ email });
    if (!business) throw BaseError.BadRequestError("Invalid credentials");

    const isPasswordValid = await bcrypt.compare(password, business.password);
    if (!isPasswordValid)
      throw BaseError.BadRequestError("Invalid credentials");

    business.lastLogin = new Date();
    await business.save();

    const businessDto = new BusinessDto(business);
    const { accessToken, refreshToken } = TokenService.generateToken({
      id: business._id,
      email: business.email,
      type: "business",
    });
    await TokenService.saveToken(business._id, refreshToken);
    return { business: businessDto, accessToken, refreshToken };
  }
  async signup({
    name,
    email,
    password,
    phoneNumber,
    description,
    address,
    businessType,
  }) {
    if (!name || !email || !password) {
      throw BaseError.BadRequestError("Name, email and password are required");
    }

    const existing = await Business.findOne({ email });
    if (existing)
      throw BaseError.BadRequestError(
        "Business with this email already exists"
      );

    const saltRounds = 12;
    const hashed = await bcrypt.hash(password, saltRounds);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const business = new Business({
      name,
      email,
      password: hashed,
      phoneNumber,
      description,
      address,
      businessType: businessType || "other",
      verificationToken,
      verificationTokenExpiresAt:
        Date.now() +
        Number(process.env.VERIFICATION_TTL_MINUTES || 10) * 60 * 1000,
      lastVerificationSentAt: new Date(),
      dailyVerificationSentCount: 1,
    });

    await business.save();

    // send verification email
    try {
      await MailService.sendVerificationEmail(
        business.email,
        verificationToken
      );
    } catch (e) {
      /* don't block signup */
    }

    const businessDto = new BusinessDto(business);
    const { accessToken, refreshToken } = TokenService.generateToken({
      id: business._id,
      email: business.email,
      type: "business",
    });
    await TokenService.saveToken(business._id, refreshToken);
    return { business: businessDto, accessToken, refreshToken };
  }
  async getMe(businessId) {
    const business = await Business.findById(businessId);
    if (!business) throw BaseError.NotFoundError("Business not found");
    return new BusinessDto(business);
  }

  async updateProfile(businessId, data, avatarFile = null, documentFiles = []) {
    const business = await Business.findById(businessId);
    if (!business) throw BaseError.NotFoundError("Business not found");

    const allowed = [
      "name",
      "email",
      "phoneNumber",
      "description",
      "address",
      "businessType",
    ];
    const update = {};

    // Text fieldlarni yangilash
    for (const key of allowed) {
      if (data[key] !== undefined) {
        update[key] = data[key];
      }
    }

    // Avatar faylini yangilash (agar yuklangan bo'lsa)
    if (avatarFile) {
      try {
        // Eski avatar o'chirish
        if (business.avatarFileId) {
          StorageService.deleteFile(business.avatarFileId).catch(() => {});
        }

        // Yangi avatar yuklash
        const avatarData = await StorageService.uploadFile(
          avatarFile,
          "business-avatars"
        );
        update.avatar = avatarData.url;
        update.avatarFileId = avatarData.id;
      } catch (error) {
        throw BaseError.BadRequestError(
          `Avatar yuklashda xatolik: ${error.message}`
        );
      }
    }

    // Location yangilash
    if (data.longitude !== undefined && data.latitude !== undefined) {
      update.location = {
        type: "Point",
        coordinates: [data.longitude, data.latitude],
      };
    }

    // Hujjat fayllarini yangilash (agar yuklangan bo'lsa)
    if (documentFiles && documentFiles.length > 0) {
      try {
        const newDocumentIds = [];
        for (const docFile of documentFiles) {
          const docData = await StorageService.uploadFile(docFile, "documents");
          newDocumentIds.push(docData.id);
        }

        // Yangi hujjatlarni qo'shish
        business.documents = [...business.documents, ...newDocumentIds];
        await business.save();
      } catch (error) {
        throw BaseError.BadRequestError(
          `Hujjat yuklashda xatolik: ${error.message}`
        );
      }
    }

    // Hech narsa yangilanmasa
    if (
      Object.keys(update).length === 0 &&
      (!documentFiles || documentFiles.length === 0)
    ) {
      throw BaseError.BadRequestError("Yangilanish uchun ma'lumot berilmagan");
    }

    // Ma'lumotlarni yangilash
    const updatedBusiness = await Business.findByIdAndUpdate(
      businessId,
      update,
      {
        new: true,
      }
    );
    return new BusinessDto(updatedBusiness);
  }

  async updateField(businessId, key, value) {
    const allowed = new Set([
      "name",
      "email",
      "phoneNumber",
      "description",
      "address",
    ]);
    if (!allowed.has(key))
      throw BaseError.BadRequestError("Field is not updatable");

    const business = await Business.findByIdAndUpdate(
      businessId,
      { [key]: value },
      { new: true }
    );
    if (!business) throw BaseError.NotFoundError("Business not found");
    return new BusinessDto(business);
  }

  async updateAvatar(businessId, avatarData) {
    if (!avatarData) throw BaseError.BadRequestError("Avatar data is required");

    const business = await Business.findById(businessId);
    if (!business) throw BaseError.NotFoundError("Business not found");

    // Eski avatar o'chirish (agar fileId bo'lsa)
    if (business.avatarFileId) {
      StorageService.deleteFile(business.avatarFileId).catch(() => {});
    }

    business.avatar = avatarData.url;
    business.avatarFileId = avatarData.id || null;
    await business.save();

    return new BusinessDto(business);
  }

  async updateLocation(businessId, coordinates) {
    if (
      !coordinates ||
      !Array.isArray(coordinates) ||
      coordinates.length !== 2
    ) {
      throw BaseError.BadRequestError(
        "Invalid coordinates. Must be [longitude, latitude]"
      );
    }

    const [longitude, latitude] = coordinates;
    if (typeof longitude !== "number" || typeof latitude !== "number") {
      throw BaseError.BadRequestError("Coordinates must be numbers");
    }

    const business = await Business.findByIdAndUpdate(
      businessId,
      {
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
      { new: true }
    );

    if (!business) throw BaseError.NotFoundError("Business not found");
    return new BusinessDto(business);
  }

  async addDocument(businessId, fileId) {
    if (!fileId) throw BaseError.BadRequestError("File ID is required");

    const business = await Business.findById(businessId);
    if (!business) throw BaseError.NotFoundError("Business not found");

    // Fayl URL'ini tekshirish
    const fileUrl = await StorageService.getFileUrl(fileId);
    if (!fileUrl) throw BaseError.BadRequestError("Invalid file ID");

    // Hujjat qo'shish
    business.documents.push(fileId);
    await business.save();

    return new BusinessDto(business);
  }

  async removeDocument(businessId, fileId) {
    if (!fileId) throw BaseError.BadRequestError("File ID is required");

    const business = await Business.findById(businessId);
    if (!business) throw BaseError.NotFoundError("Business not found");

    // Hujjatni o'chirish
    business.documents = business.documents.filter((doc) => doc !== fileId);
    await business.save();

    // Faylni storage'dan ham o'chirish
    StorageService.deleteFile(fileId).catch(() => {});

    return new BusinessDto(business);
  }

  async deleteMe(businessId) {
    const business = await Business.findById(businessId);
    if (!business) throw BaseError.NotFoundError("Business not found");

    // Avatar va hujjatlarni o'chirish
    if (business.avatarFileId) {
      StorageService.deleteFile(business.avatarFileId).catch(() => {});
    }

    for (const docId of business.documents) {
      StorageService.deleteFile(docId).catch(() => {});
    }

    await Business.findByIdAndDelete(businessId);
    return { success: true };
  }

  async changePassword(businessId, currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      throw BaseError.BadRequestError(
        "Current password and new password are required"
      );
    }

    const business = await Business.findById(businessId);
    if (!business) throw BaseError.NotFoundError("Business not found");

    // Joriy parolni tekshirish
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      business.password
    );
    if (!isCurrentPasswordValid) {
      throw BaseError.BadRequestError("Current password is incorrect");
    }

    // Yangi parolni hash qilish
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    business.password = hashedPassword;
    await business.save();

    return { success: true };
  }

  async verifyEmail(code) {
    if (!code) throw BaseError.BadRequestError("Verification code is required");

    const business = await Business.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!business)
      throw BaseError.BadRequestError("Invalid or expired verification code");

    business.isVerified = true;
    business.verificationToken = undefined;
    business.verificationTokenExpiresAt = undefined;
    await business.save();

    const businessDto = new BusinessDto(business);
    const { accessToken, refreshToken } = TokenService.generateToken({
      id: business._id,
      email: business.email,
      type: "business",
    });
    await TokenService.saveToken(business._id, refreshToken);
    return { business: businessDto, accessToken, refreshToken };
  }

  async resendVerification(email) {
    if (!email) throw BaseError.BadRequestError("Email is required");

    const business = await Business.findOne({ email });
    if (!business) throw BaseError.NotFoundError("Business not found");

    if (business.isVerified)
      throw BaseError.BadRequestError("Business is already verified");

    // Cooldown check (5 minutes)
    const cooldownMinutes = 5;
    if (
      business.lastVerificationSentAt &&
      Date.now() - business.lastVerificationSentAt.getTime() <
        cooldownMinutes * 60 * 1000
    ) {
      throw BaseError.BadRequestError(
        `Please wait ${cooldownMinutes} minutes before requesting another verification code`
      );
    }

    // Daily limit check (5 per day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (
      business.lastVerificationSentAt &&
      business.lastVerificationSentAt >= today
    ) {
      if (business.dailyVerificationSentCount >= 5) {
        throw BaseError.BadRequestError(
          "Daily verification limit reached. Please try again tomorrow"
        );
      }
    } else {
      business.dailyVerificationSentCount = 0;
    }

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    business.verificationToken = verificationToken;
    business.verificationTokenExpiresAt =
      Date.now() +
      Number(process.env.VERIFICATION_TTL_MINUTES || 10) * 60 * 1000;
    business.lastVerificationSentAt = new Date();
    business.dailyVerificationSentCount += 1;
    await business.save();

    // Send verification email
    try {
      await MailService.sendVerificationEmail(
        business.email,
        verificationToken
      );
    } catch (error) {
      throw BaseError.InternalServerError("Failed to send verification email");
    }

    return { success: true };
  }
}

export default new BusinessService();
