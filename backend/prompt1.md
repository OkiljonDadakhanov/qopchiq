Prompt: “Storage Abstraction Layer” yaratish (Appwrite bilan)

Goal:
Loyihada rasmlar, fayllar va avatarlar uchun yagona fayl saqlash tizimi kerak.
Hozir Appwrite Storage’dan foydalanaman, lekin keyinchalik AWS S3, Cloudinary yoki Supabase Storage’ga o‘tishim mumkin.
Shu sababli, FileStorage nomli universal interfeys (abstraction layer) yaratmoqchiman, va unga Appwrite implementatsiyasini yozmoqchiman.

🔧 Structure:
backend/
├── services/
│   ├── storage/
│   │   ├── fileStorage.js          # Universal interfeys
│   │   ├── appwriteStorage.js      # Appwrite implementatsiyasi
│   │   ├── s3Storage.js            # (keyinchalik qo‘shiladi)
│   │   └── cloudinaryStorage.js    # (keyinchalik qo‘shiladi)
│   └── ...
├── controllers/
│   └── file.controller.js          # upload/delete uchun universal controller
├── routes/
│   └── file.route.js               # file.controller bilan ishlovchi route
└── app.js                          # /api/files route’ni ulash

✳️ Asosiy talablar

1. fileStorage.js (Base class)
Cursor quyidagicha bazaviy interfeys class yaratadi:

export default class FileStorage {
  async uploadFile(file, folder = 'general') {
    throw new Error("uploadFile() not implemented");
  }

  async deleteFile(fileId) {
    throw new Error("deleteFile() not implemented");
  }

  async getFileUrl(fileId) {
    throw new Error("getFileUrl() not implemented");
  }
}


2. appwriteStorage.js
Appwrite uchun implementatsiya quyidagicha bo‘lsin:

.env dan APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY, APPWRITE_BUCKET_ID oladi

uploadFile(), deleteFile(), getFileUrl() funksiyalarini bajaradi

Faylni vaqtincha /uploads papkaga saqlaydi, so‘ng Appwrite’ga yuklaydi, so‘ng uni o‘chiradi

Natijada { id, url, name } obyekt qaytaradi

3. file.controller.js
Universal fayl controller:

import storage from "../services/storage/appwriteStorage.js";

export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const result = await storage.uploadFile(file, "uploads");
    res.json({ success: true, file: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    await storage.deleteFile(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


4. file.route.js
Express router fayl:

import { Router } from "express";
import multer from "multer";
import { uploadFile, deleteFile } from "../controllers/file.controller.js";

const router = Router();
const upload = multer(); // memory storage

router.post("/upload", upload.single("file"), uploadFile);
router.delete("/:id", deleteFile);

export default router;


5. app.js
Routerni ulash:

import fileRoutes from "./routes/file.route.js";
app.use("/api/files", fileRoutes);

⚡️ Key Requirements

Barcha controller va service’lar Appwrite haqida bilmasin, faqat FileStorage interfeysi bilan ishlasin.

Kelajakda S3 yoki Cloudinary implementatsiyasini qo‘shish uchun faqat bitta fayl (storageProvider.js yoki appwriteStorage.js)ni almashtirish kifoya bo‘lsin.

Kod async/await uslubida, toza va TypeScriptga mos yozilsin.

uploadFile() faylni yuklagach, url qaytarsin.

Agar .env da STORAGE_PROVIDER=appwrite bo‘lsa, Appwrite’dan foydalansin; s3 bo‘lsa, S3 implementatsiyasiga o‘tsin (modular arxitektura).

🧩 Extra (optional)

Agar vaqt bo‘lsa:

storageFactory.js degan fayl yarating, u .env dagi STORAGE_PROVIDER ni o‘qib, tegishli provider’ni tanlasin.

avatar, product, post controllerlarida FileService’ni ishlatadigan qilib misol yozing.