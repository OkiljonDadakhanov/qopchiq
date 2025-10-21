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

  async updateProfile(userId, data) {
    const allowed = ["name", "email", "phone"]; // phone qo'shildi
    const update = {};
    for (const key of allowed)
      if (data[key] !== undefined) update[key] = data[key];
    if (Object.keys(update).length === 0)
      throw BaseError.BadRequestError("Nothing to update");
    const user = await User.findByIdAndUpdate(userId, update, { new: true });
    if (!user) throw BaseError.NotFoundError("User not found");
    return new UserDto(user);
  }

  async updateField(userId, key, value) {
    const allowed = new Set(["name", "email", "phone"]);
    if (!allowed.has(key))
      throw BaseError.BadRequestError("Field is not updatable");
    const user = await User.findByIdAndUpdate(
      userId,
      { [key]: value },
      { new: true }
    );
    if (!user) throw BaseError.NotFoundError("User not found");
    return new UserDto(user);
  }

  async updateAvatar(userId, avatarData) {
    if (!avatarData) throw BaseError.BadRequestError("Avatar data is required");

    const user = await User.findById(userId);
    if (!user) throw BaseError.NotFoundError("User not found");

    // Eski avatar o'chirish (agar fileId bo'lsa)
    if (user.avatarFileId) {
      StorageService.deleteFile(user.avatarFileId).catch(() => {});
    }

    user.avatar = avatarData.url;
    user.avatarFileId = avatarData.id || null;
    await user.save();

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
