import multer from "multer";

// Memory storage for temporary file handling
const storage = multer.memoryStorage();

// File filter for avatar and documents
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    // Images for avatar
    "image/jpeg",
    "image/png",
    "image/gif",
    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

// Multer config
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Middleware for business profile updates
export const businessUpload = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "documents", maxCount: 5 },
]);
