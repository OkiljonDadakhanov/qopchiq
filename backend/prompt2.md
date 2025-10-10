🧠 Cursor Command Prompt: Modular File Storage Architecture

Goal:
Loyihada rasm, avatar va fayllarni boshqarish uchun yagona, kengaytiriladigan File Storage Layer yaratish.
Hozir Appwrite ishlataman, lekin keyinchalik AWS S3, Cloudinary yoki Supabase Storage’ga o‘tishim mumkin.
Arxitektura shunday bo‘lsinki — boshqa storage tizimiga o‘tish uchun faqat bitta provider faylini almashtirish kifoya bo‘lsin.

🧱 Create File Structure

Please create these files inside /backend/services/storage/:

fileStorage.js          # Base interface (abstract class)
appwriteStorage.js      # Appwrite implementation
storageFactory.js       # Provider selector


And also create:

/backend/controllers/file.controller.js
/backend/routes/file.route.js

🧩 Implementation Details
✅ /backend/services/storage/fileStorage.js

Create a base class defining the common interface for all storage providers:

export default class FileStorage {
  async uploadFile(file, folder = "general") {
    throw new Error("uploadFile() not implemented");
  }

  async deleteFile(fileId) {
    throw new Error("deleteFile() not implemented");
  }

  async getFileUrl(fileId) {
    throw new Error("getFileUrl() not implemented");
  }
}

✅ /backend/services/storage/appwriteStorage.js

Implement Appwrite-based storage provider.
It should:

Use environment variables:
APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY, APPWRITE_BUCKET_ID

Upload the file temporarily to /uploads, then send to Appwrite.

Return this object on success:

{
  id: string,
  url: string,
  name: string,
  mimeType: string,
  size: number
}


On error, return a clear Error(message).

✅ /backend/services/storage/storageFactory.js

Create a storage selector that chooses the correct provider dynamically:

import AppwriteStorage from "./appwriteStorage.js";
import FileStorage from "./fileStorage.js";

const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || "appwrite";

let storage;

switch (STORAGE_PROVIDER) {
  case "appwrite":
    storage = new AppwriteStorage();
    break;
  // future: add "s3", "cloudinary", etc.
  default:
    throw new Error(`Unsupported storage provider: ${STORAGE_PROVIDER}`);
}

export default storage;

✅ /backend/controllers/file.controller.js

Controller should use the unified interface:

import storage from "../services/storage/storageFactory.js";

export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const result = await storage.uploadFile(file, "uploads");
    return res.json({ success: true, file: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    await storage.deleteFile(id);
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

✅ /backend/routes/file.route.js

Define a simple Express router with multer for memory-based file upload:

import { Router } from "express";
import multer from "multer";
import { uploadFile, deleteFile } from "../controllers/file.controller.js";

const router = Router();
const upload = multer();

router.post("/upload", upload.single("file"), uploadFile);
router.delete("/:id", deleteFile);

export default router;

✅ Integrate into app.js

Attach the route:

import fileRoutes from "./routes/file.route.js";
app.use("/api/files", fileRoutes);

⚙️ Environment Variables (.env)

Make sure you have:

STORAGE_PROVIDER=appwrite
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key
APPWRITE_BUCKET_ID=your_bucket_id

🚀 Requirements for Cursor

Generate clean, maintainable ES modules.

Use async/await.

All storage logic must live in /services/storage.

Other controllers (e.g. user, post, product) will import storageFactory and use it without knowing about Appwrite.

Future providers (s3Storage.js, cloudinaryStorage.js) should follow the same FileStorage interface.

🧠 Example Future Use
// In user.service.js (for avatar)
const uploaded = await storage.uploadFile(req.file, "avatars");
await User.findByIdAndUpdate(userId, { avatar: uploaded.url });

// In product.service.js
const image = await storage.uploadFile(req.file, "products");
product.imageUrl = image.url;


“Implement this modular file storage architecture in my project with Appwrite as the default provider.”