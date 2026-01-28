import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Business } from "../models/bussiness.model.js";
import BaseError from "../errors/base.error.js";
import BusinessDto from "../dtos/business.dto.js";
import StorageService from "./storage.service.js";
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
    await TokenService.saveToken(business._id, refreshToken, {
      ownerType: "Business",
    });
    return { business: businessDto, accessToken, refreshToken };
  }

  async signup({ name, email, password, phoneNumber, description, address }) {
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
      verificationToken,
      verificationTokenExpiresAt:
        Date.now() +
        Number(process.env.VERIFICATION_TTL_MINUTES || 10) * 60 * 1000,
      lastVerificationSentAt: new Date(),
      dailyVerificationSentCount: 1,
    });

    await business.save();

    try {
      await MailService.sendVerificationEmail(
        business.email,
        verificationToken
      );
    } catch (e) {
      // do not block signup if email fails
    }

    const businessDto = new BusinessDto(business);
    const { accessToken, refreshToken } = TokenService.generateToken({
      id: business._id,
      email: business.email,
      type: "business",
    });
    await TokenService.saveToken(business._id, refreshToken, {
      ownerType: "Business",
    });
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

    // Text fieldlarni yangilash
    const allowed = [
      "name",
      "email",
      "phoneNumber",
      "description",
      "address",
      "businessType",
    ];
    const update = {};

    for (const key of allowed) {
      if (data[key] !== undefined) {
        update[key] = data[key];
      }
    }

    // Location yangilash
    if (data.longitude !== undefined && data.latitude !== undefined) {
      update.location = {
        type: "Point",
        coordinates: [parseFloat(data.longitude), parseFloat(data.latitude)],
      };
    }

    // Avatar faylini yangilash
    if (avatarFile) {
      try {
        // Eski avatarni o'chirish
        if (business.avatarFileId) {
          await StorageService.deleteFile(business.avatarFileId).catch(
            () => {}
          );
        }

        // Yangi avatarni yuklash
        const avatarData = await StorageService.uploadFile(
          avatarFile,
          "business-avatars"
        );

        // StorageService response format: { id, url, name, mimeType, size }
        if (avatarData && avatarData.url) {
          update.avatar = avatarData.url;
          update.avatarFileId = avatarData.id;
          console.log("Avatar uploaded successfully:", avatarData);
        } else {
          console.error("Avatar upload failed:", avatarData);
        }
      } catch (error) {
        console.error("Avatar upload error:", error);
      }
    }

    // Hujjatlarni yuklash
    if (documentFiles && documentFiles.length > 0) {
      try {
        const newDocumentIds = [];
        for (const docFile of documentFiles) {
          const docData = await StorageService.uploadFile(
            docFile,
            "business-documents"
          );

          // StorageService response format: { id, url, name, mimeType, size }
          if (docData && docData.id) {
            newDocumentIds.push(docData.id);
            console.log("Document uploaded successfully:", docData);
          } else {
            console.error("Document upload failed:", docData);
          }
        }

        // Yangi hujjatlarni qo'shish
        if (newDocumentIds.length > 0) {
          update.documents = [...(business.documents || []), ...newDocumentIds];
        }
      } catch (error) {
        console.error("Document upload error:", error);
      }
    } // Hech narsa yangilanmasa
    if (Object.keys(update).length === 0) {
      throw BaseError.BadRequestError("Nothing to update");
    }

    // Ma'lumotlarni yangilash
    const updatedBusiness = await Business.findByIdAndUpdate(
      businessId,
      update,
      { new: true, runValidators: true }
    );

    return new BusinessDto(updatedBusiness);
  }

  async deleteMe(businessId) {
    const business = await Business.findById(businessId);
    if (!business) throw BaseError.NotFoundError("Business not found");

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

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      business.password
    );
    if (!isCurrentPasswordValid) {
      throw BaseError.BadRequestError("Current password is incorrect");
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    business.password = hashedPassword;
    await business.save();

    return { success: true };
  }
}

export default new BusinessService();
