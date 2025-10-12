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

	async updateProfile(businessId, data, avatarFile, documentFiles, locationCoordinates) {
		const allowed = ["name", "email", "phoneNumber", "description", "address", "businessType"];
		const update = {};
		for (const key of allowed) if (data[key] !== undefined) update[key] = data[key];

		const business = await Business.findById(businessId);
		if (!business) throw BaseError.NotFoundError("Business not found");

		// Avatar file berilgan bo'lsa, Appwrite'ga yuklash
		if (avatarFile) {
			try {
				const uploadResult = await StorageService.uploadFile(avatarFile);
				
				// Eski avatar o'chirish
				if (business.avatarFileId) {
					StorageService.deleteFile(business.avatarFileId).catch(() => {});
				}

				update.avatar = uploadResult.url;
				update.avatarFileId = uploadResult.id;
			} catch (error) {
				throw BaseError.BadRequestError("Avatar yuklashda xatolik: " + error.message);
			}
		}

		// Location coordinates berilgan bo'lsa
		if (locationCoordinates) {
			if (!Array.isArray(locationCoordinates) || locationCoordinates.length !== 2) {
				throw BaseError.BadRequestError("Invalid coordinates. Must be [longitude, latitude]");
			}

			const [longitude, latitude] = locationCoordinates;
			if (typeof longitude !== "number" || typeof latitude !== "number") {
				throw BaseError.BadRequestError("Coordinates must be numbers");
			}

			update.location = {
				type: "Point",
				coordinates: [longitude, latitude]
			};
		}

		// Document files berilgan bo'lsa
		if (documentFiles && documentFiles.length > 0) {
			try {
				const uploadPromises = documentFiles.map(file => StorageService.uploadFile(file));
				const uploadResults = await Promise.all(uploadPromises);
				
				// Yangi hujjatlarni qo'shish
				const newDocumentIds = uploadResults.map(result => result.id);
				business.documents = [...business.documents, ...newDocumentIds];
				await business.save();
			} catch (error) {
				throw BaseError.BadRequestError("Documents yuklashda xatolik: " + error.message);
			}
		}

		if (Object.keys(update).length === 0 && !documentFiles) {
			throw BaseError.BadRequestError("Nothing to update");
		}
		
		const updatedBusiness = await Business.findByIdAndUpdate(businessId, update, { new: true });
		return new BusinessDto(updatedBusiness);
	}

	async updateField(businessId, key, value) {
		const allowed = new Set(["name", "email", "phoneNumber", "description", "address"]);
		if (!allowed.has(key)) throw BaseError.BadRequestError("Field is not updatable");
		
		const business = await Business.findByIdAndUpdate(businessId, { [key]: value }, { new: true });
		if (!business) throw BaseError.NotFoundError("Business not found");
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

