import storage from "./storage/storageFactory.js";

class StorageService {
  async uploadFile(file, folder = "general") {
    if (!file || !file.buffer) {
      throw new Error("File not provided or invalid format");
    }

    // Fayl validatsiyasi
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error("Ruxsat etilmagan fayl formati");
    }

    // Fayl hajmi chegarasi (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Fayl hajmi 5MB dan kichik bo'lishi kerak");
    }

    return await storage.uploadFile(file, folder);
  }

  async deleteFile(fileId) {
    if (!fileId) return;
    return await storage.deleteFile(fileId);
  }

  async getFileUrl(fileId) {
    if (!fileId) return null;
    return await storage.getFileUrl(fileId);
  }
}

export default new StorageService();
