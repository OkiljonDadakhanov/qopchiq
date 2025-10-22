import multer from "multer";

// Fayl validatsiyasi
const fileFilter = (req, file, cb) => {
  // Rasm va hujjat fayllarini tekshirish
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimetype === "application/vnd.ms-excel" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Faqat rasm va hujjat fayllari ruxsat etilgan"), false);
  }
};

// Fayl hajmi chegarasi (10MB)
const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB
};

const upload = multer({
  storage: multer.memoryStorage(), // Memory'da saqlash
  fileFilter,
  limits,
});

// Business profil yangilash uchun middleware
export const businessProfileUpload = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "documents", maxCount: 10 },
]);

export default upload;
