import multer from "multer";

// Fayl validatsiyasi
const fileFilter = (req, file, cb) => {
	// Rasm fayllarini tekshirish
	if (file.mimetype.startsWith("image/")) {
		cb(null, true);
	} else {
		cb(new Error("Faqat rasm fayllari ruxsat etilgan"), false);
	}
};

// Fayl hajmi chegarasi (5MB)
const limits = {
	fileSize: 5 * 1024 * 1024, // 5MB
};

const upload = multer({
	storage: multer.memoryStorage(), // Memory'da saqlash
	fileFilter,
	limits,
});

export default upload;
