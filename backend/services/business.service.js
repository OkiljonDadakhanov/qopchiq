import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Business } from "../models/bussiness.model.js";
import BaseError from "../errors/base.error.js";
import BusinessDto from "../dtos/business.dto.js";
import StorageService from "./storage.service.js";
import MailService from "./mail.service.js";
import TokenService from "./token.service.js";

const buildLocationFromPayload = (payload) => {
        if (!payload) return undefined;
        if (Array.isArray(payload)) {
                if (payload.length !== 2) return undefined;
                const [longitude, latitude] = payload.map(Number);
                if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) return undefined;
                return { type: "Point", coordinates: [longitude, latitude] };
        }
        if (payload.coordinates && Array.isArray(payload.coordinates) && payload.coordinates.length === 2) {
                        const [longitude, latitude] = payload.coordinates.map(Number);
                        if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) return undefined;
                        return { type: "Point", coordinates: [longitude, latitude] };
        }
        return undefined;
};

class BusinessService {
        async login(email, password) {
                if (!email || !password) throw BaseError.BadRequestError("Email and password are required");

                const business = await Business.findOne({ email });
                if (!business) throw BaseError.BadRequestError("Invalid credentials");

                const isPasswordValid = await bcrypt.compare(password, business.password);
                if (!isPasswordValid) throw BaseError.BadRequestError("Invalid credentials");

                business.lastLogin = new Date();
                await business.save();

                const businessDto = new BusinessDto(business);
                const { accessToken, refreshToken } = TokenService.generateToken({ id: business._id, email: business.email, type: "business" });
                await TokenService.saveToken(business._id, refreshToken, { ownerType: "Business" });
                return { business: businessDto, accessToken, refreshToken };
        }

        async signup({ name, email, password, phoneNumber, description, address }) {
                if (!name || !email || !password) {
                        throw BaseError.BadRequestError("Name, email and password are required");
                }

                const existing = await Business.findOne({ email });
                if (existing) throw BaseError.BadRequestError("Business with this email already exists");

                const saltRounds = 12;
                const hashed = await bcrypt.hash(password, saltRounds);

                const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

                const business = new Business({
                        name,
                        email,
                        password: hashed,
                        phoneNumber,
                        description,
                        address,
                        verificationToken,
                        verificationTokenExpiresAt: Date.now() + Number(process.env.VERIFICATION_TTL_MINUTES || 10) * 60 * 1000,
                        lastVerificationSentAt: new Date(),
                        dailyVerificationSentCount: 1,
                });

                await business.save();

                try {
                        await MailService.sendVerificationEmail(business.email, verificationToken);
                } catch (e) {
                        // do not block signup if email fails
                }

                const businessDto = new BusinessDto(business);
                const { accessToken, refreshToken } = TokenService.generateToken({ id: business._id, email: business.email, type: "business" });
                await TokenService.saveToken(business._id, refreshToken, { ownerType: "Business" });
                return { business: businessDto, accessToken, refreshToken };
        }

        async getMe(businessId) {
                const business = await Business.findById(businessId);
                if (!business) throw BaseError.NotFoundError("Business not found");
                return new BusinessDto(business);
        }

        async updateProfile(businessId, data) {
                const allowed = ["name", "email", "phoneNumber", "description", "address"];
                const update = {};
                for (const key of allowed) {
                        if (data[key] !== undefined) update[key] = data[key];
                }

                const location = buildLocationFromPayload(data.location);
                if (location) update.location = location;

                if (Object.keys(update).length === 0) throw BaseError.BadRequestError("Nothing to update");

                const business = await Business.findByIdAndUpdate(businessId, update, { new: true, runValidators: true });
                if (!business) throw BaseError.NotFoundError("Business not found");
                return new BusinessDto(business);
        }

        async updateField(businessId, key, value) {
                const allowed = new Set(["name", "email", "phoneNumber", "description", "address"]);
                if (!allowed.has(key)) throw BaseError.BadRequestError("Field is not updatable");

                const business = await Business.findByIdAndUpdate(businessId, { [key]: value }, { new: true, runValidators: true });
                if (!business) throw BaseError.NotFoundError("Business not found");
                return new BusinessDto(business);
        }

        async updateAvatar(businessId, avatarData) {
                if (!avatarData || (!avatarData.url && !avatarData.file?.url)) {
                        throw BaseError.BadRequestError("Avatar data is required");
                }

                const business = await Business.findById(businessId);
                if (!business) throw BaseError.NotFoundError("Business not found");

                if (business.avatarFileId) {
                        StorageService.deleteFile(business.avatarFileId).catch(() => {});
                }

                const fileId = avatarData.id || avatarData.fileId || avatarData.file?.id || null;
                const fileUrl = avatarData.url || avatarData.file?.url;

                business.avatar = fileUrl;
                business.avatarFileId = fileId;
                await business.save();

                return new BusinessDto(business);
        }

        async updateLocation(businessId, coordinates) {
                const location = buildLocationFromPayload(coordinates);
                if (!location) {
                        throw BaseError.BadRequestError("Invalid coordinates. Must be [longitude, latitude]");
                }

                const business = await Business.findByIdAndUpdate(
                        businessId,
                        { location },
                        { new: true }
                );

                if (!business) throw BaseError.NotFoundError("Business not found");
                return new BusinessDto(business);
        }

        async addDocument(businessId, fileId) {
                if (!fileId) throw BaseError.BadRequestError("File ID is required");

                const business = await Business.findById(businessId);
                if (!business) throw BaseError.NotFoundError("Business not found");

                const fileUrl = await StorageService.getFileUrl(fileId);
                if (!fileUrl) throw BaseError.BadRequestError("Invalid file ID");

                business.documents.push(fileId);
                await business.save();

                return new BusinessDto(business);
        }

        async removeDocument(businessId, fileId) {
                if (!fileId) throw BaseError.BadRequestError("File ID is required");

                const business = await Business.findById(businessId);
                if (!business) throw BaseError.NotFoundError("Business not found");

                business.documents = business.documents.filter((doc) => doc !== fileId);
                await business.save();

                StorageService.deleteFile(fileId).catch(() => {});

                return new BusinessDto(business);
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
                        throw BaseError.BadRequestError("Current password and new password are required");
                }

                const business = await Business.findById(businessId);
                if (!business) throw BaseError.NotFoundError("Business not found");

                const isCurrentPasswordValid = await bcrypt.compare(currentPassword, business.password);
                if (!isCurrentPasswordValid) {
                        throw BaseError.BadRequestError("Current password is incorrect");
                }

                const saltRounds = 12;
                const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

                business.password = hashedPassword;
                await business.save();

                return { success: true };
        }

        async listBranches(businessId) {
                const business = await Business.findById(businessId);
                if (!business) throw BaseError.NotFoundError("Business not found");
                return new BusinessDto(business).branches;
        }

        async createBranch(businessId, payload) {
                if (!payload?.name) {
                        throw BaseError.BadRequestError("Branch name is required");
                }
                const business = await Business.findById(businessId);
                if (!business) throw BaseError.NotFoundError("Business not found");

                const branch = {
                        _id: new mongoose.Types.ObjectId(),
                        name: payload.name,
                        address: payload.address || "",
                        phoneNumber: payload.phoneNumber || "",
                        location: buildLocationFromPayload(payload.location),
                        isActive: payload.isActive !== undefined ? !!payload.isActive : true,
                };

                business.branches.push(branch);
                await business.save();

                return new BusinessDto(business);
        }

        async updateBranch(businessId, branchId, payload) {
                if (!mongoose.Types.ObjectId.isValid(branchId)) {
                        throw BaseError.BadRequestError("Invalid branch id");
                }
                const business = await Business.findById(businessId);
                if (!business) throw BaseError.NotFoundError("Business not found");

                const branch = business.branches.id(branchId);
                if (!branch) throw BaseError.NotFoundError("Branch not found");

                if (payload.name !== undefined) branch.name = payload.name;
                if (payload.address !== undefined) branch.address = payload.address;
                if (payload.phoneNumber !== undefined) branch.phoneNumber = payload.phoneNumber;
                if (payload.isActive !== undefined) branch.isActive = !!payload.isActive;

                const location = buildLocationFromPayload(payload.location);
                if (location) branch.location = location;

                branch.updatedAt = new Date();

                await business.save();

                return new BusinessDto(business);
        }

        async removeBranch(businessId, branchId) {
                if (!mongoose.Types.ObjectId.isValid(branchId)) {
                        throw BaseError.BadRequestError("Invalid branch id");
                }
                const business = await Business.findById(businessId);
                if (!business) throw BaseError.NotFoundError("Business not found");

                const branch = business.branches.id(branchId);
                if (!branch) throw BaseError.NotFoundError("Branch not found");

                branch.deleteOne();
                await business.save();

                return new BusinessDto(business);
        }
}

export default new BusinessService();
