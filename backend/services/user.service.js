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

  async updateProfile(userId, data, avatarFile = null) {
    const user = await User.findById(userId);
    if (!user) throw BaseError.NotFoundError("User not found");

    const allowed = ["name", "email", "phone"];
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
        if (user.avatarFileId) {
          StorageService.deleteFile(user.avatarFileId).catch(() => {});
        }

        // Yangi avatar yuklash
        const avatarData = await StorageService.uploadFile(
          avatarFile,
          "avatars"
        );
        update.avatar = avatarData.url;
        update.avatarFileId = avatarData.id;
      } catch (error) {
        throw BaseError.BadRequestError(
          `Avatar yuklashda xatolik: ${error.message}`
        );
      }
    }

    // Hech narsa yangilanmasa
    if (Object.keys(update).length === 0) {
      throw BaseError.BadRequestError("Yangilanish uchun ma'lumot berilmagan");
    }

    // Ma'lumotlarni yangilash
    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
    });
    return new UserDto(updatedUser);
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
