import { Business } from "../models/bussiness.model.js";
import BaseError from "../errors/base.error.js";
import BusinessDto from "../dtos/business.dto.js";
import StorageService from "./storage.service.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

class BusinessService {
	async getMe(businessId) {
		const business = await Business.findById(businessId);
		if (!business) throw BaseError.NotFoundError("Business not found");
		return new BusinessDto(business);
	}

	async updateProfile(businessId, data) {
		const allowed = ["name", "email", "phoneNumber", "description", "address"];
		const update = {};
		for (const key of allowed) if (data[key] !== undefined) update[key] = data[key];
		
		if (Object.keys(update).length === 0) throw BaseError.BadRequestError("Nothing to update");
		
		const business = await Business.findByIdAndUpdate(businessId, update, { new: true });
		if (!business) throw BaseError.NotFoundError("Business not found");
		return new BusinessDto(business);
	}

	async updateField(businessId, key, value) {
		const allowed = new Set(["name", "email", "phoneNumber", "description", "address"]);
		if (!allowed.has(key)) throw BaseError.BadRequestError("Field is not updatable");
		
		const business = await Business.findByIdAndUpdate(businessId, { [key]: value }, { new: true });
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
		if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
			throw BaseError.BadRequestError("Invalid coordinates. Must be [longitude, latitude]");
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
					coordinates: [longitude, latitude]
				}
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
		business.documents = business.documents.filter(doc => doc !== fileId);
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
			throw BaseError.BadRequestError("Current password and new password are required");
		}

		const business = await Business.findById(businessId);
		if (!business) throw BaseError.NotFoundError("Business not found");

		// Joriy parolni tekshirish
		const isCurrentPasswordValid = await bcrypt.compare(currentPassword, business.password);
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
}

export default new BusinessService();

