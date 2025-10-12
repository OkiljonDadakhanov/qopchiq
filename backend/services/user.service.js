import { User } from "../models/user.model.js";
import BaseError from "../errors/base.error.js";
import UserDto from "../dtos/user.dto.js";
import StorageService from "./storage.service.js";

class UserService {
	async getMe(userId) {
		const user = await User.findById(userId);
		if (!user) throw BaseError.NotFoundError("User not found");
		return new UserDto(user);
	}

	async updateProfile(userId, data, avatarFile) {
		const allowed = ["name", "email", "phone"];
		const update = {};
		for (const key of allowed) if (data[key] !== undefined) update[key] = data[key];

		const user = await User.findById(userId);
		if (!user) throw BaseError.NotFoundError("User not found");

		// Avatar file berilgan bo'lsa, Appwrite'ga yuklash
		if (avatarFile) {
			try {
				const uploadResult = await StorageService.uploadFile(avatarFile);
				
				// Eski avatar o'chirish
				if (user.avatarFileId) {
					StorageService.deleteFile(user.avatarFileId).catch(() => {});
				}

				update.avatar = uploadResult.url;
				update.avatarFileId = uploadResult.id;
			} catch (error) {
				throw BaseError.BadRequestError("Avatar yuklashda xatolik: " + error.message);
			}
		}

		if (Object.keys(update).length === 0) throw BaseError.BadRequestError("Nothing to update");
		
		const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true });
		return new UserDto(updatedUser);
	}

	async updateField(userId, key, value) {
		const allowed = new Set(["name", "email", "phone"]);
		if (!allowed.has(key)) throw BaseError.BadRequestError("Field is not updatable");
		const user = await User.findByIdAndUpdate(userId, { [key]: value }, { new: true });
		if (!user) throw BaseError.NotFoundError("User not found");
		return new UserDto(user);
	}


	async deleteMe(userId) {
		const user = await User.findById(userId);
		if (!user) throw BaseError.NotFoundError("User not found");

		// Avatar o'chirish
		if (user.avatarFileId) {
			StorageService.deleteFile(user.avatarFileId).catch(() => {});
		}

		await User.findByIdAndDelete(userId);
		return { success: true };
	}

}

export default new UserService();


