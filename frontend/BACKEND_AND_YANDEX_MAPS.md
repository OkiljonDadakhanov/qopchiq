backend/dtos/business.dto.js:
add:
 this.documents = business.documents || [];

delete:
 this.documents = business.documents
      ? business.documents.map((docId) => ({
          id: docId,
          url: `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${docId}/view?project=${process.env.APPWRITE_PROJECT_ID}`,
        }))
      : [];

 backend/services/business.service.js:

import FileService from "./file.service.js";


class BusinessService {
  async getDocumentInfo(docId) {
    if (!docId) return null;
    const fileInfo = await FileService.getFileInfo(docId);
    if (!fileInfo.success) return null;
    return {
      id: fileInfo.file.id,
      url: fileInfo.file.url,
      name: fileInfo.file.originalName,
      mimeType: fileInfo.file.mimeType,
      size: fileInfo.file.size,
    };
  }

  async getBusinessDocuments(business) {
    if (!business.documents || !Array.isArray(business.documents)) {
      return [];
    }

    const documents = [];
    for (const docId of business.documents) {
      const docInfo = await this.getDocumentInfo(docId);
      if (docInfo) {
        documents.push(docInfo);
      }
    }
    return documents;
  }


  backend/services/storage.service.js:
  delete:
  async uploadFile(file, folder = "general") {
		if (!file || !file.buffer) {
			throw new Error("File not provided or invalid format");
		}

		// Fayl validatsiyasi
		if (!file.mimetype.startsWith("image/")) {
			throw new Error("Faqat rasm fayllari ruxsat etilgan");
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

    add:

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

backend/controllers/business.controller.js:

add:
// Form data dan text fieldlarni olish
    const data = {};
    if (req.body.name) data.name = req.body.name;
    if (req.body.email) data.email = req.body.email;
    if (req.body.phoneNumber) data.phoneNumber = req.body.phoneNumber;
    if (req.body.businessName) data.businessName = req.body.businessName;
    if (req.body.description) data.description = req.body.description;
    if (req.body.address) data.address = req.body.address;
    if (req.body.businessType) data.businessType = req.body.businessType;
    if (req.body.longitude) data.longitude = parseFloat(req.body.longitude);
    if (req.body.latitude) data.latitude = parseFloat(req.body.latitude);

    delete:
        const data = { ...req.body };

         // Handle file uploads
    if (req.files) {
      // Handle avatar upload
      if (req.files.avatar) {
        const avatarFile = req.files.avatar[0];
        const uploadResult = await StorageService.uploadFile(
          avatarFile,
          "business-avatars"
        );
        data.avatar = {
          id: uploadResult.id,
          url: uploadResult.url,
        };
      }

      backend/controllers/user.controller.js:
      import UserService from "../services/user.service.js";

export const getMe = async (req, res, next) => {
	try {
		const user = await UserService.getMe(req.userId);
		return res.json({ success: true, user });
	} catch (error) {
		return next(error);
	}
  try {
    const user = await UserService.getMe(req.userId);
    return res.json({ success: true, user });
  } catch (error) {
    return next(error);
  }
};

export const updateProfile = async (req, res, next) => {
	try {
		const user = await UserService.updateProfile(req.userId, req.body);
		return res.json({ success: true, user });
	} catch (error) {
		return next(error);
	}
};
  try {
    // Form data dan text fieldlarni olish
    const data = {};
    if (req.body.name) data.name = req.body.name;
    if (req.body.email) data.email = req.body.email;
    if (req.body.phone) data.phone = req.body.phone;

export const updateField = async (req, res, next) => {
	try {
		const { key } = req.params;
		const { value } = req.body;
		const user = await UserService.updateField(req.userId, key, value);
		return res.json({ success: true, user });
	} catch (error) {
		return next(error);
	}
};
    // Avatar faylini olish (agar yuklangan bo'lsa)
    const avatarFile = req.file || null;

export const deleteMe = async (req, res, next) => {
	try {
		await UserService.deleteMe(req.userId);
		return res.json({ success: true });
	} catch (error) {
		return next(error);
	}
    const user = await UserService.updateProfile(req.userId, data, avatarFile);
    return res.json({ success: true, user });
  } catch (error) {
    return next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
	try {
		const { avatar } = req.body;
		const user = await UserService.updateAvatar(req.userId, avatar);
		return res.json({ success: true, user });
	} catch (error) {
		return next(error);
	}
export const deleteMe = async (req, res, next) => {
  try {
    await UserService.deleteMe(req.userId);
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};



backend/middlewares/upload.middleware.js:
Skip to content
Navigation Menu
OkiljonDadakhanov
qopchiq

Type / to search
Code
Issues
Pull requests
Actions
Projects
Security
Insights
Settings
Commit 3100f44
warmergroup
warmergroup
committed
11 hours ago
feat: update user and bussiness api
main
1 parent 
040affe
 commit 
3100f44
File tree
Filter files…
backend
controllers
business.controller.js
user.controller.js
middlewares
upload.middleware.js
postman_collection.json
routes
business.route.js
index.js
user.route.js
services
business.service.js
user.service.js
frontend
api/services
auth.ts
business-auth.ts
profile.ts
app
business/profile
page.tsx
verify
page.tsx
components/profile
edit-profile-form.tsx
hooks
profile.ts
16 files changed
+920
-1155
lines changed
Search within code
 
‎backend/controllers/business.controller.js‎
+21
-35
Lines changed: 21 additions & 35 deletions
Original file line number	Diff line number	Diff line change
@@ -13,44 +13,30 @@ export const getMe = async (req, res, next) => {

export const updateProfile = async (req, res, next) => {
  try {
    const data = { ...req.body };
    // Form data dan text fieldlarni olish
    const data = {};
    if (req.body.name) data.name = req.body.name;
    if (req.body.email) data.email = req.body.email;
    if (req.body.phoneNumber) data.phoneNumber = req.body.phoneNumber;
    if (req.body.businessName) data.businessName = req.body.businessName;
    if (req.body.description) data.description = req.body.description;
    if (req.body.address) data.address = req.body.address;
    if (req.body.businessType) data.businessType = req.body.businessType;
    if (req.body.longitude) data.longitude = parseFloat(req.body.longitude);
    if (req.body.latitude) data.latitude = parseFloat(req.body.latitude);

    // Handle file uploads
    if (req.files) {
      // Handle avatar upload
      if (req.files.avatar) {
        const avatarFile = req.files.avatar[0];
        const uploadResult = await StorageService.uploadFile(
          avatarFile,
          "business-avatars"
        );
        data.avatar = {
          id: uploadResult.id,
          url: uploadResult.url,
        };
      }
    // Avatar faylini olish (agar yuklangan bo'lsa)
    const avatarFile = req.file || null;

      // Handle documents upload
      if (req.files.documents) {
        const documentFiles = Array.isArray(req.files.documents)
          ? req.files.documents
          : [req.files.documents];
        data.documents = [];
    // Hujjat fayllarini olish (agar yuklangan bo'lsa)
    const documentFiles = req.files ? req.files : [];

        for (const docFile of documentFiles) {
          const uploadResult = await StorageService.uploadFile(
            docFile,
            "documents"
          );
          data.documents.push({
            id: uploadResult.id,
            url: uploadResult.url,
          });
        }
      }
    }
    const business = await BusinessService.updateProfile(req.userId, data);
    const business = await BusinessService.updateProfile(
      req.userId,
      data,
      avatarFile,
      documentFiles
    );
    return res.json({ success: true, business });
  } catch (error) {
    return next(error);
‎backend/controllers/user.controller.js‎
+26
-40
Lines changed: 26 additions & 40 deletions
Original file line number	Diff line number	Diff line change
@@ -1,51 +1,37 @@
import UserService from "../services/user.service.js";

export const getMe = async (req, res, next) => {
	try {
		const user = await UserService.getMe(req.userId);
		return res.json({ success: true, user });
	} catch (error) {
		return next(error);
	}
  try {
    const user = await UserService.getMe(req.userId);
    return res.json({ success: true, user });
  } catch (error) {
    return next(error);
  }
};

export const updateProfile = async (req, res, next) => {
	try {
		const user = await UserService.updateProfile(req.userId, req.body);
		return res.json({ success: true, user });
	} catch (error) {
		return next(error);
	}
};
  try {
    // Form data dan text fieldlarni olish
    const data = {};
    if (req.body.name) data.name = req.body.name;
    if (req.body.email) data.email = req.body.email;
    if (req.body.phone) data.phone = req.body.phone;

export const updateField = async (req, res, next) => {
	try {
		const { key } = req.params;
		const { value } = req.body;
		const user = await UserService.updateField(req.userId, key, value);
		return res.json({ success: true, user });
	} catch (error) {
		return next(error);
	}
};
    // Avatar faylini olish (agar yuklangan bo'lsa)
    const avatarFile = req.file || null;

export const deleteMe = async (req, res, next) => {
	try {
		await UserService.deleteMe(req.userId);
		return res.json({ success: true });
	} catch (error) {
		return next(error);
	}
    const user = await UserService.updateProfile(req.userId, data, avatarFile);
    return res.json({ success: true, user });
  } catch (error) {
    return next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
	try {
		const { avatar } = req.body;
		const user = await UserService.updateAvatar(req.userId, avatar);
		return res.json({ success: true, user });
	} catch (error) {
		return next(error);
	}
export const deleteMe = async (req, res, next) => {
  try {
    await UserService.deleteMe(req.userId);
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};
‎backend/middlewares/upload.middleware.js‎
+11
-10
Lines changed: 11 additions & 10 deletions
Original file line number	Diff line number	Diff line change
@@ -2,23 +2,24 @@ import multer from "multer";

// Fayl validatsiyasi
const fileFilter = (req, file, cb) => {
	// Rasm fayllarini tekshirish
	if (file.mimetype.startsWith("image/")) {
		cb(null, true);
	} else {
		cb(new Error("Faqat rasm fayllari ruxsat etilgan"), false);
	}
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
  fileSize: 5 * 1024 * 1024, // 5MB
};

const upload = multer({
	storage: multer.memoryStorage(), // Memory'da saqlash
	fileFilter,
	limits,
  storage: multer.memoryStorage(), // Memory'da saqlash
  fileFilter,
  limits,
});

export { upload };
export default upload;
‎backend/postman_collection.json‎
+35
-254
Lines changed: 35 additions & 254 deletions
Original file line number	Diff line number	Diff line change
@@ -1,7 +1,7 @@
{
  "info": {
    "name": "Qopchiq API V0.0.5",
    "description": "Complete API endpoints for Qopchiq application with authentication, user management, business management, and file upload",
    "name": "Qopchiq API V0.0.6 - Optimized",
    "description": "Complete API endpoints for Qopchiq application with optimized user profile management. Universal updateProfile API allows updating any combination of fields (name, email, phone, avatar) in a single request.",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
@@ -264,7 +264,7 @@
    },
    {
      "name": "Users",
      "description": "User profile management endpoints",
      "description": "Optimized user profile management with universal update API. Single endpoint for updating any combination of profile fields.",
      "item": [
        {
          "name": "Get Me",
@@ -285,7 +285,7 @@
          }
        },
        {
          "name": "Update Profile",
          "name": "Update Profile (Universal)",
          "request": {
            "method": "PATCH",
            "header": [
@@ -305,59 +305,30 @@
                {
                  "key": "name",
                  "value": "Updated Name",
                  "type": "text"
                  "type": "text",
                  "description": "Optional: Update user name"
                },
                {
                  "key": "email",
                  "value": "updated@example.com",
                  "type": "text"
                  "type": "text",
                  "description": "Optional: Update user email"
                },
                {
                  "key": "phone",
                  "value": "+998901234567",
                  "type": "text"
                  "type": "text",
                  "description": "Optional: Update user phone"
                },
                {
                  "key": "avatar",
                  "type": "file",
                  "src": []
                  "src": [],
                  "description": "Optional: Upload new avatar image. Automatically uploads to Appwrite and sets avatar URL. Old avatar is automatically deleted."
                }
              ]
            },
            "description": "Update profile fields including avatar file. Avatar file is optional. If provided, automatically uploads to Appwrite and sets avatar URL."
          }
        },
        {
          "name": "Update Single Field",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{ACCESS_TOKEN}}"
              }
            ],
            "url": {
              "raw": "{{BASE_URL}}/api/users/me/:key",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "users", "me", ":key"],
              "variable": [
                {
                  "key": "key",
                  "value": "name",
                  "description": "Field to update (name, email, phone)"
                }
              ]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n  \"value\": \"Only Name Updated\"\n}"
            },
            "description": "Update a single field by key (name, email, phone)"
            "description": "Universal profile update API. Update any combination of fields (name, email, phone, avatar) in a single request. All fields are optional. Avatar file is automatically uploaded to Appwrite and old avatar is deleted."
          }
        },
        {
@@ -380,71 +351,6 @@
        }
      ]
    },
    {
      "name": "Upload",
      "description": "File upload endpoints",
      "item": [
        {
          "name": "Upload File",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{ACCESS_TOKEN}}"
              }
            ],
            "url": {
              "raw": "{{BASE_URL}}/api/upload/upload?folder=general",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "upload", "upload"],
              "query": [
                {
                  "key": "folder",
                  "value": "general",
                  "description": "avatars, business-avatars, documents, posts"
                }
              ]
            },
            "body": {
              "mode": "formdata",
              "formdata": [
                {
                  "key": "file",
                  "type": "file",
                  "src": []
                }
              ]
            },
            "description": "Upload a file and get {id, url, name, size, mimeType}"
          }
        },
        {
          "name": "Delete File",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{ACCESS_TOKEN}}"
              }
            ],
            "url": {
              "raw": "{{BASE_URL}}/api/upload/file/:fileId",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "upload", "file", ":fileId"],
              "variable": [
                {
                  "key": "fileId",
                  "value": "file-id-here"
                }
              ]
            },
            "description": "Delete a file by ID"
          }
        }
      ]
    },
    {
      "name": "Business",
      "description": "Business profile management endpoints",
@@ -468,7 +374,7 @@
          }
        },
        {
          "name": "Update Business Profile",
          "name": "Update Business Profile (Universal)",
          "request": {
            "method": "PATCH",
            "header": [
@@ -488,191 +394,66 @@
                {
                  "key": "name",
                  "value": "Updated Business Name",
                  "type": "text"
                  "type": "text",
                  "description": "Optional: Update business name"
                },
                {
                  "key": "email",
                  "value": "business@example.com",
                  "type": "text"
                  "type": "text",
                  "description": "Optional: Update business email"
                },
                {
                  "key": "phoneNumber",
                  "value": "+998901234567",
                  "type": "text"
                  "type": "text",
                  "description": "Optional: Update business phone"
                },
                {
                  "key": "description",
                  "value": "Business description",
                  "type": "text"
                  "type": "text",
                  "description": "Optional: Update business description"
                },
                {
                  "key": "address",
                  "value": "Business address",
                  "type": "text"
                  "type": "text",
                  "description": "Optional: Update business address"
                },
                {
                  "key": "businessType",
                  "value": "restaurant",
                  "type": "text"
                  "type": "text",
                  "description": "Optional: Update business type"
                },
                {
                  "key": "longitude",
                  "value": "69.2401",
                  "type": "text"
                  "type": "text",
                  "description": "Optional: Update longitude coordinate"
                },
                {
                  "key": "latitude",
                  "value": "41.2995",
                  "type": "text"
                  "type": "text",
                  "description": "Optional: Update latitude coordinate"
                },
                {
                  "key": "avatar",
                  "type": "file",
                  "src": []
                  "src": [],
                  "description": "Optional: Upload new business avatar. Automatically uploads to Appwrite and sets avatar URL. Old avatar is automatically deleted."
                },
                {
                  "key": "documents",
                  "type": "file",
                  "src": []
                }
              ]
            },
            "description": "Update business profile fields including avatar, location coordinates, and documents. All files are optional. If provided, automatically uploads to Appwrite and sets URLs."
          }
        },
        {
          "name": "Update Business Field",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{ACCESS_TOKEN}}"
              }
            ],
            "url": {
              "raw": "{{BASE_URL}}/api/auth/business/me/:key",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "auth", "business", "me", ":key"],
              "variable": [
                {
                  "key": "key",
                  "value": "name",
                  "description": "name, email, phoneNumber, description, address, businessType"
                }
              ]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n    \"value\": \"New value\"\n}"
            },
            "description": "Update a specific business field"
          }
        },
        {
          "name": "Update Business Avatar",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{ACCESS_TOKEN}}"
              }
            ],
            "url": {
              "raw": "{{BASE_URL}}/api/auth/business/me/avatar",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "auth", "business", "me", "avatar"]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n    \"avatar\": {\n        \"id\": \"file-id-here\",\n        \"url\": \"https://example.com/avatar.jpg\"\n    }\n}"
            },
            "description": "Update business avatar using file ID and URL"
          }
        },
        {
          "name": "Update Business Location",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{ACCESS_TOKEN}}"
              }
            ],
            "url": {
              "raw": "{{BASE_URL}}/api/auth/business/me/location",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "auth", "business", "me", "location"]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n    \"coordinates\": [69.2401, 41.2995]\n}"
            },
            "description": "Update business location coordinates [longitude, latitude]"
          }
        },
        {
          "name": "Add Document",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{ACCESS_TOKEN}}"
              }
            ],
            "url": {
              "raw": "{{BASE_URL}}/api/auth/business/me/documents",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "auth", "business", "me", "documents"]
            },
            "body": {
              "mode": "raw",
              "raw": "{\n    \"fileId\": \"file-id-here\"\n}"
            },
            "description": "Add a document to business profile"
          }
        },
        {
          "name": "Remove Document",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{ACCESS_TOKEN}}"
              }
            ],
            "url": {
              "raw": "{{BASE_URL}}/api/auth/business/me/documents/:fileId",
              "host": ["{{BASE_URL}}"],
              "path": ["api", "auth", "business", "me", "documents", ":fileId"],
              "variable": [
                {
                  "key": "fileId",
                  "value": "file-id-to-remove"
                  "src": [],
                  "description": "Optional: Upload new business documents. Automatically uploads to Appwrite and adds to documents list."
                }
              ]
            },
            "description": "Remove a document by file ID"
            "description": "Universal business profile update API. Update any combination of fields (name, email, phone, description, address, businessType, location, avatar, documents) in a single request. All fields are optional. Files are automatically uploaded to Appwrite."
          }
        },
        {
‎backend/routes/business.route.js‎
+1
-17
Lines changed: 1 addition & 17 deletions
Original file line number	Diff line number	Diff line change
@@ -2,11 +2,6 @@ import express from "express";
import {
  getMe,
  updateProfile,
  updateField,
  updateAvatar,
  updateLocation,
  addDocument,
  removeDocument,
  deleteMe,
  changePassword,
} from "../controllers/business.controller.js";
@@ -18,19 +13,8 @@ const router = express.Router();
// Business profil ma'lumotlari
router.get("/me", authGuard, getMe);

// Profil yangilash (fayl yuklash bilan)
// Universal profil yangilash (text fieldlar + avatar + hujjatlar + location)
router.patch("/me", authGuard, businessProfileUpload, updateProfile);
router.patch("/me/:key", authGuard, updateField);
// Avatar yangilash (URL bilan)
router.patch("/me/avatar", authGuard, updateAvatar);
// Location yangilash
router.patch("/me/location", authGuard, updateLocation);
// Hujjatlar boshqaruvi
router.post("/me/documents", authGuard, addDocument);
router.delete("/me/documents/:fileId", authGuard, removeDocument);

// Parol o'zgartirish
router.patch("/me/password", authGuard, changePassword);
‎backend/routes/index.js‎
Whitespace-only changes.
‎backend/routes/user.route.js‎
+8
-11
Lines changed: 8 additions & 11 deletions
Original file line number	Diff line number	Diff line change
@@ -1,24 +1,21 @@
import express from "express";
import { getMe, updateProfile, updateField, updateAvatar, deleteMe } from "../controllers/user.controller.js";
import {
  getMe,
  updateProfile,
  deleteMe,
} from "../controllers/user.controller.js";
import { authGuard } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Profil ma'lumotlari
router.get("/me", authGuard, getMe);

// Profil yangilash
router.patch("/me", authGuard, updateProfile);
// Avatar yangilash (URL bilan) - boshqa route'lardan oldin
router.patch("/me/avatar", authGuard, updateAvatar);
// Boshqa field'lar yangilash
router.patch("/me/:key", authGuard, updateField);
// Universal profil yangilash (text fieldlar + avatar fayl)
router.patch("/me", authGuard, upload.single("avatar"), updateProfile);

// Profil o'chirish
router.delete("/me", authGuard, deleteMe);

export default router;
‎backend/services/business.service.js‎
+61
-31
Lines changed: 61 additions & 31 deletions
Original file line number	Diff line number	Diff line change
@@ -101,7 +101,10 @@ class BusinessService {
    return new BusinessDto(business);
  }

  async updateProfile(businessId, data) {
  async updateProfile(businessId, data, avatarFile = null, documentFiles = []) {
    const business = await Business.findById(businessId);
    if (!business) throw BaseError.NotFoundError("Business not found");
    const allowed = [
      "name",
      "email",
@@ -111,53 +114,80 @@ class BusinessService {
      "businessType",
    ];
    const update = {};
    for (const key of allowed)
      if (data[key] !== undefined) update[key] = data[key];
    // Handle avatar upload
    if (data.avatar) {
      const business = await Business.findById(businessId);
      if (!business) throw BaseError.NotFoundError("Business not found");

      // Delete old avatar if exists
      if (business.avatarFileId) {
        StorageService.deleteFile(business.avatarFileId).catch(() => {});
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
        if (business.avatarFileId) {
          StorageService.deleteFile(business.avatarFileId).catch(() => {});
        }

      update.avatar = data.avatar.url;
      update.avatarFileId = data.avatar.id;
        // Yangi avatar yuklash
        const avatarData = await StorageService.uploadFile(
          avatarFile,
          "business-avatars"
        );
        update.avatar = avatarData.url;
        update.avatarFileId = avatarData.id;
      } catch (error) {
        throw BaseError.BadRequestError(
          `Avatar yuklashda xatolik: ${error.message}`
        );
      }
    }

    // Handle location update
    // Location yangilash
    if (data.longitude !== undefined && data.latitude !== undefined) {
      update.location = {
        type: "Point",
        coordinates: [data.longitude, data.latitude],
      };
    }

    // Handle documents upload
    if (data.documents && Array.isArray(data.documents)) {
      const business = await Business.findById(businessId);
      if (!business) throw BaseError.NotFoundError("Business not found");
      // Add new documents
      for (const doc of data.documents) {
        if (doc.id && !business.documents.includes(doc.id)) {
          business.documents.push(doc.id);
    // Hujjat fayllarini yangilash (agar yuklangan bo'lsa)
    if (documentFiles && documentFiles.length > 0) {
      try {
        const newDocumentIds = [];
        for (const docFile of documentFiles) {
          const docData = await StorageService.uploadFile(docFile, "documents");
          newDocumentIds.push(docData.id);
        }
        // Yangi hujjatlarni qo'shish
        business.documents = [...business.documents, ...newDocumentIds];
        await business.save();
      } catch (error) {
        throw BaseError.BadRequestError(
          `Hujjat yuklashda xatolik: ${error.message}`
        );
      }
      await business.save();
    }

    if (Object.keys(update).length === 0 && !data.documents)
      throw BaseError.BadRequestError("Nothing to update");
    // Hech narsa yangilanmasa
    if (
      Object.keys(update).length === 0 &&
      (!documentFiles || documentFiles.length === 0)
    ) {
      throw BaseError.BadRequestError("Yangilanish uchun ma'lumot berilmagan");
    }

    const business = await Business.findByIdAndUpdate(businessId, update, {
      new: true,
    });
    if (!business) throw BaseError.NotFoundError("Business not found");
    return new BusinessDto(business);
    // Ma'lumotlarni yangilash
    const updatedBusiness = await Business.findByIdAndUpdate(
      businessId,
      update,
      {
        new: true,
      }
    );
    return new BusinessDto(updatedBusiness);
  }

  async updateField(businessId, key, value) {
‎backend/services/user.service.js‎
+56
-47
Lines changed: 56 additions & 47 deletions
Original file line number	Diff line number	Diff line change
@@ -4,63 +4,72 @@ import UserDto from "../dtos/user.dto.js";
import StorageService from "./storage.service.js";

class UserService {
	async getMe(userId) {
		const user = await User.findById(userId);
		if (!user) throw BaseError.NotFoundError("User not found");
		return new UserDto(user);
	}
  async getMe(userId) {
    const user = await User.findById(userId);
    if (!user) throw BaseError.NotFoundError("User not found");
    return new UserDto(user);
  }

	async updateProfile(userId, data) {
		const allowed = ["name", "email", "phone"]; // phone qo'shildi
		const update = {};
		for (const key of allowed) if (data[key] !== undefined) update[key] = data[key];
		if (Object.keys(update).length === 0) throw BaseError.BadRequestError("Nothing to update");
		const user = await User.findByIdAndUpdate(userId, update, { new: true });
		if (!user) throw BaseError.NotFoundError("User not found");
		return new UserDto(user);
	}
  async updateProfile(userId, data, avatarFile = null) {
    const user = await User.findById(userId);
    if (!user) throw BaseError.NotFoundError("User not found");

	async updateField(userId, key, value) {
		const allowed = new Set(["name", "email", "phone"]);
		if (!allowed.has(key)) throw BaseError.BadRequestError("Field is not updatable");
		const user = await User.findByIdAndUpdate(userId, { [key]: value }, { new: true });
		if (!user) throw BaseError.NotFoundError("User not found");
		return new UserDto(user);
	}
    const allowed = ["name", "email", "phone"];
    const update = {};

	async updateAvatar(userId, avatarData) {
		if (!avatarData) throw BaseError.BadRequestError("Avatar data is required");
		
		const user = await User.findById(userId);
		if (!user) throw BaseError.NotFoundError("User not found");
    // Text fieldlarni yangilash
    for (const key of allowed) {
      if (data[key] !== undefined) {
        update[key] = data[key];
      }
    }

		// Eski avatar o'chirish (agar fileId bo'lsa)
		if (user.avatarFileId) {
			StorageService.deleteFile(user.avatarFileId).catch(() => {});
		}
    // Avatar faylini yangilash (agar yuklangan bo'lsa)
    if (avatarFile) {
      try {
        // Eski avatar o'chirish
        if (user.avatarFileId) {
          StorageService.deleteFile(user.avatarFileId).catch(() => {});
        }

		user.avatar = avatarData.url;
		user.avatarFileId = avatarData.id || null;
		await user.save();
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

		return new UserDto(user);
	}
    // Hech narsa yangilanmasa
    if (Object.keys(update).length === 0) {
      throw BaseError.BadRequestError("Yangilanish uchun ma'lumot berilmagan");
    }

	async deleteMe(userId) {
		const user = await User.findById(userId);
		if (!user) throw BaseError.NotFoundError("User not found");
    // Ma'lumotlarni yangilash
    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
    });
    return new UserDto(updatedUser);
  }

		// Avatar o'chirish
		if (user.avatarFileId) {
			StorageService.deleteFile(user.avatarFileId).catch(() => {});
		}
  async deleteMe(userId) {
    const user = await User.findById(userId);
    if (!user) throw BaseError.NotFoundError("User not found");

		await User.findByIdAndDelete(userId);
		return { success: true };
	}
    // Avatar o'chirish
    if (user.avatarFileId) {
      StorageService.deleteFile(user.avatarFileId).catch(() => {});
    }

    await User.findByIdAndDelete(userId);
    return { success: true };
  }
}

export default new UserService();
‎frontend/api/services/auth.ts‎
+42
-35
Lines changed: 42 additions & 35 deletions
Original file line number	Diff line number	Diff line change
@@ -1,12 +1,14 @@
import client from "../client"
import authClient from "../authClient"
import type { SignUpCredentials, AuthResponse } from "../../types/types"
import client from "../client";
import authClient from "../authClient";
import type { SignUpCredentials, AuthResponse } from "../../types/types";

// ✅ Centralized error handler
const handleAuthError = (error: any): never => {
  console.error("Auth service error:", error)
  throw new Error(error?.response?.data?.message || error.message || "Authentication failed")
}
  console.error("Auth service error:", error);
  throw new Error(
    error?.response?.data?.message || error.message || "Authentication failed"
  );
};

// ===============================
// AUTH SERVICES
@@ -16,66 +18,71 @@ export const registerUser = async (
  payload: SignUpCredentials
): Promise<AuthResponse | undefined> => {
  try {
    const { data } = await client.post("/api/auth/signup", payload)
    return data as AuthResponse
    const { data } = await client.post("/api/auth/signup", payload);
    return data as AuthResponse;
  } catch (error) {
    handleAuthError(error)
    handleAuthError(error);
  }
}
};

export const loginUser = async (
  payload: { email: string; password: string }
): Promise<AuthResponse | undefined> => {
export const loginUser = async (payload: {
  email: string;
  password: string;
}): Promise<AuthResponse | undefined> => {
  try {
    const { data } = await client.post("/api/auth/login", payload)
    return data as AuthResponse
    const { data } = await client.post("/api/auth/login", payload);
    return data as AuthResponse;
  } catch (error) {
    handleAuthError(error)
    handleAuthError(error);
  }
}
};

export const verifyEmail = async (payload: { code: string }): Promise<void> => {
  try {
    await client.post("api/auth/verify-email", payload)
    await client.post("/api/auth/verify-email", payload);
  } catch (error) {
    handleAuthError(error)
    handleAuthError(error);
  }
}
};

export const logoutUser = async (): Promise<void> => {
  try {
    await authClient.post("/api/auth/logout")
    await authClient.post("/api/auth/logout");
  } catch (error) {
    console.warn("Logout request failed:", error)
    console.warn("Logout request failed:", error);
  }
}
};

export const forgotPassword = async (payload: { email: string }): Promise<void> => {
export const forgotPassword = async (payload: {
  email: string;
}): Promise<void> => {
  try {
    await client.post("/api/auth/forgot-password", payload)
    await client.post("/api/auth/forgot-password", payload);
  } catch (error) {
    handleAuthError(error)
    handleAuthError(error);
  }
}
};

export const resetPassword = async (
  token: string,
  payload: { password: string }
): Promise<void> => {
  try {
    await client.post(`/api/auth/reset-password/${token}`, payload)
    await client.post(`/api/auth/reset-password/${token}`, payload);
  } catch (error) {
    handleAuthError(error)
    handleAuthError(error);
  }
}
};

export const resendVerification = async (payload: { email: string }): Promise<void> => {
export const resendVerification = async (payload: {
  email: string;
}): Promise<void> => {
  try {
    await client.post("/api/auth/resend-verification", payload)
    await client.post("/api/auth/resend-verification", payload);
  } catch (error) {
    handleAuthError(error)
    handleAuthError(error);
  }
}
};

export default {
  registerUser,
@@ -85,4 +92,4 @@ export default {
  forgotPassword,
  resetPassword,
  resendVerification,
}
};
‎frontend/api/services/business-auth.ts‎
+48
-37
Lines changed: 48 additions & 37 deletions
Original file line number	Diff line number	Diff line change
@@ -1,84 +1,95 @@
import axios from "axios"
import axios from "axios";

import client from "@/api/client"
import { useBusinessStore } from "@/store/business-store"
import client from "@/api/client";
import { useBusinessStore } from "@/store/business-store";
import type {
  BusinessAccount,
  BusinessAuthResponse,
  BusinessLoginPayload,
  BusinessSignupPayload,
} from "@/types/business"
} from "@/types/business";

const BUSINESS_ENDPOINTS = {
  signup: "/api/auth/business/signup",
  login: "/api/auth/business/login",
  me: "/api/business/me",
}
  me: "/api/auth/business/me",
};

const persistBusinessSession = (data: BusinessAuthResponse) => {
  const { setBusiness } = useBusinessStore.getState()
  const { setBusiness } = useBusinessStore.getState();
  setBusiness({
    business: data.business ?? null,
    token: data.accessToken ?? null,
  })
  console.log('Business session persisted:', { 
    businessId: data.business?.id, 
    hasToken: !!data.accessToken 
  })
}
  });
  console.log("Business session persisted:", {
    businessId: data.business?.id,
    hasToken: !!data.accessToken,
  });
};

const handleBusinessError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const message =
      (error.response?.data as { message?: string; error?: string })?.message ||
      (error.response?.data as { message?: string; error?: string })?.error ||
      error.message ||
      "Business authentication failed"
    throw new Error(message)
      "Business authentication failed";
    throw new Error(message);
  }

  if (error instanceof Error) {
    throw error
    throw error;
  }

  throw new Error("An unexpected error occurred")
}
  throw new Error("An unexpected error occurred");
};

export const signupBusiness = async (
  payload: BusinessSignupPayload
): Promise<BusinessAuthResponse> => {
  try {
    const { data } = await client.post<BusinessAuthResponse>(BUSINESS_ENDPOINTS.signup, payload)
    persistBusinessSession(data)
    return data
    const { data } = await client.post<BusinessAuthResponse>(
      BUSINESS_ENDPOINTS.signup,
      payload
    );
    persistBusinessSession(data);
    return data;
  } catch (error) {
    return handleBusinessError(error)
    return handleBusinessError(error);
  }
}
};

export const loginBusiness = async (
  payload: BusinessLoginPayload
): Promise<BusinessAuthResponse> => {
  try {
    const { data } = await client.post<BusinessAuthResponse>(BUSINESS_ENDPOINTS.login, payload)
    persistBusinessSession(data)
    return data
    const { data } = await client.post<BusinessAuthResponse>(
      BUSINESS_ENDPOINTS.login,
      payload
    );
    persistBusinessSession(data);
    return data;
  } catch (error) {
    return handleBusinessError(error)
    return handleBusinessError(error);
  }
}
};

export const logoutBusiness = () => {
  const { clear } = useBusinessStore.getState()
  clear()
}
  const { clear } = useBusinessStore.getState();
  clear();
};

export const getBusinessProfile = async (): Promise<{ success: boolean; business: BusinessAccount }> => {
export const getBusinessProfile = async (): Promise<{
  success: boolean;
  business: BusinessAccount;
}> => {
  try {
    const { data } = await client.get<{ success: boolean; business: BusinessAccount }>(BUSINESS_ENDPOINTS.me)
    return data
    const { data } = await client.get<{
      success: boolean;
      business: BusinessAccount;
    }>(BUSINESS_ENDPOINTS.me);
    return data;
  } catch (error) {
    return handleBusinessError(error)
    return handleBusinessError(error);
  }
}
};
‎frontend/api/services/profile.ts‎
+63
-90
Lines changed: 63 additions & 90 deletions
Original file line number	Diff line number	Diff line change
@@ -1,25 +1,30 @@
import authClient from '@/api/authClient';
import { uploadAvatar } from '@/api/services/upload';
import type { UserProfile, UpdateProfileData, ChangePasswordData } from '@/types/profile';
import authClient from "@/api/authClient";
import type {
  UserProfile,
  UpdateProfileData,
  ChangePasswordData,
} from "@/types/profile";

// ✅ Professional error handling for profile services
const handleProfileError = (error: any) => {
  console.error('Profile service error:', error);
  throw new Error(error.message || 'Profile operation failed');
  console.error("Profile service error:", error);
  throw new Error(error.message || "Profile operation failed");
};

export const fetchUserProfile = async (options?: { signal?: AbortSignal }): Promise<UserProfile> => {
export const fetchUserProfile = async (options?: {
  signal?: AbortSignal;
}): Promise<UserProfile> => {
  try {
    const { data } = await authClient.get('/api/users/me', {
    const { data } = await authClient.get("/api/users/me", {
      signal: options?.signal,
    });
    // API may return { user: { ... } } or return the user object directly
    const payload = data?.user ?? data;
    
    if (!payload) {
      throw new Error('No profile data received');
      throw new Error("No profile data received");
    }
    
    // ✅ Map API field names to expected field names
    const mappedProfile = {
      ...payload,
@@ -30,10 +35,9 @@ export const fetchUserProfile = async (options?: { signal?: AbortSignal }): Prom
      updatedAt: payload.updatedAt || "",
      lastLogin: payload.lastLogin || "",
    };
    
    // ✅ Debug: Log date information
   
    
    return mappedProfile as UserProfile;
  } catch (error) {
    handleProfileError(error);
@@ -42,19 +46,21 @@ export const fetchUserProfile = async (options?: { signal?: AbortSignal }): Prom
};

// ✅ Fetch updated profile after avatar update
export const fetchUpdatedProfile = async (options?: { signal?: AbortSignal }): Promise<UserProfile> => {
export const fetchUpdatedProfile = async (options?: {
  signal?: AbortSignal;
}): Promise<UserProfile> => {
  try {
    const { data } = await authClient.get('/api/users/me', {
    const { data } = await authClient.get("/api/users/me", {
      signal: options?.signal,
    });
    
    // API may return { user: { ... } } or return the user object directly
    const payload = data?.user ?? data;
    
    if (!payload) {
      throw new Error('No updated profile data received');
      throw new Error("No updated profile data received");
    }
    
    // ✅ Map API field names to expected field names
    const mappedProfile = {
      ...payload,
@@ -65,71 +71,67 @@ export const fetchUpdatedProfile = async (options?: { signal?: AbortSignal }): P
      updatedAt: payload.updatedAt || "",
      lastLogin: payload.lastLogin || "",
    };
    
    return mappedProfile as UserProfile;
  } catch (error) {
    handleProfileError(error);
    throw error;
  }
};

// ✅ Update avatar with two-step process: upload file then update user
export const updateAvatar = async (file: File): Promise<UserProfile> => {
// ✅ Universal profile update with text fields and avatar file
export const updateUserProfile = async (
  payload: UpdateProfileData,
  avatarFile?: File
): Promise<UserProfile> => {
  try {
    // Step 1: Upload the file
    const uploadResponse = await uploadAvatar(file);
    
    // Step 2: Update user profile with avatar data
    const avatarData = {
      avatar: {
        id: uploadResponse.file.id,
        url: uploadResponse.file.url
      }
    };
    
    // Step 3: Update the user's avatar
    await authClient.patch('/api/users/me/avatar', avatarData);
    
    // Step 4: Fetch the updated profile to get the complete user data
    const updatedProfile = await fetchUpdatedProfile();
    
    return updatedProfile;
  } catch (error) {
    handleProfileError(error);
    throw error;
  }
};
    // Create FormData for universal API
    const formData = new FormData();
    // Add text fields
    if (payload.name) formData.append("name", payload.name);
    if (payload.email) formData.append("email", payload.email);
    if (payload.phone) formData.append("phone", payload.phone);
    // Add avatar file if provided
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    const { data } = await authClient.patch("/api/users/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

export const updateUserProfile = async (payload: UpdateProfileData): Promise<UserProfile> => {
  try {
    const { data } = await authClient.patch('/api/users/me', payload);
    const payloadData = data?.user ?? data;
    
    if (!payloadData) {
      throw new Error('No updated profile data received');
      throw new Error("No updated profile data received");
    }
    
    // ✅ Map API field names to expected field names
    const mappedProfile = {
      ...payloadData,
      phone: payloadData.phoneNumber || payloadData.phone, // Handle both phoneNumber and phone
      avatar: payloadData.avatar || null, // Ensure avatar is properly handled
      // ✅ Keep date fields as they are (already in ISO format from API)
      phone: payloadData.phoneNumber || payloadData.phone,
      avatar: payloadData.avatar || null,
      createdAt: payloadData.createdAt || "",
      updatedAt: payloadData.updatedAt || "",
      lastLogin: payloadData.lastLogin || "",
    };
    
    return mappedProfile as UserProfile;
  } catch (error) {
    handleProfileError(error);
    throw error; // Re-throw the error to maintain the Promise rejection
    throw error;
  }
};

export const changeUserPassword = async (payload: ChangePasswordData): Promise<void> => {
export const changeUserPassword = async (
  payload: ChangePasswordData
): Promise<void> => {
  try {
    const { data } = await authClient.post('/api/change-password', payload);
    const { data } = await authClient.post("/api/change-password", payload);
    return data as void;
  } catch (error) {
    handleProfileError(error);
@@ -139,45 +141,17 @@ export const changeUserPassword = async (payload: ChangePasswordData): Promise<v

export const deleteUser = async (): Promise<void> => {
  try {
    const { data } = await authClient.delete('/api/users/me');
    const { data } = await authClient.delete("/api/users/me");
    return data as void;
  } catch (error) {
    handleProfileError(error);
    throw error; // Re-throw the error to maintain the Promise rejection
  }
};

// ✅ Update single field (avatar, phone, etc.)
export const updateUserField = async (key: string, value: string): Promise<UserProfile> => {
  try {
    const { data } = await authClient.patch(`/api/users/me/${key}`, { [key]: value });
    const payloadData = data?.user ?? data;
    
    if (!payloadData) {
      throw new Error('No updated profile data received');
    }
    
    // ✅ Map API field names to expected field names
    const mappedProfile = {
      ...payloadData,
      phone: payloadData.phoneNumber || payloadData.phone, // Handle both phoneNumber and phone
      avatar: payloadData.avatar || null, // Ensure avatar is properly handled
      // ✅ Keep date fields as they are (already in ISO format from API)
      createdAt: payloadData.createdAt || "",
      updatedAt: payloadData.updatedAt || "",
      lastLogin: payloadData.lastLogin || "",
    };
    
    return mappedProfile as UserProfile;
  } catch (error) {
    handleProfileError(error);
    throw error;
  }
};
// ✅ Update phone number specifically  
// ✅ Update phone number specifically (convenience method)
export const updatePhone = async (phone: string): Promise<UserProfile> => {
  return updateUserField('phone', phone);
  return updateUserProfile({ phone }, undefined);
};

export default {
@@ -186,4 +160,3 @@ export default {
  changeUserPassword,
  deleteUser,
};
‎frontend/app/business/profile/page.tsx‎
+285
-296
Lines changed: 285 additions & 296 deletions
Large diffs are not rendered by default.
‎frontend/app/verify/page.tsx‎
+67
-60
Lines changed: 67 additions & 60 deletions
Original file line number	Diff line number	Diff line change
@@ -1,108 +1,112 @@
"use client"
"use client";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useResendVerification } from "@/hooks/auth"
import { useUserEmail } from "@/store/store"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useResendVerification } from "@/hooks/auth";
import { useUserEmail } from "@/store/store";

export default function VerifyEmailPage() {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendTimer, setResendTimer] = useState(0)
  const [canResend, setCanResend] = useState(false)
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const router = useRouter()
  const { toast } = useToast()
  const userEmail = useUserEmail()
  const resendVerificationMutation = useResendVerification()
  const router = useRouter();
  const { toast } = useToast();
  const userEmail = useUserEmail();
  const resendVerificationMutation = useResendVerification();

  // Countdown timer for resend
  useEffect(() => {
    let interval: NodeJS.Timeout
    let interval: NodeJS.Timeout;

    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
            setCanResend(true);
            return 0;
          }
          return prev - 1
        })
      }, 1000)
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [resendTimer])
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Start countdown on mount
  useEffect(() => {
    setResendTimer(60)
    setCanResend(false)
  }, [])
    setResendTimer(60);
    setCanResend(false);
  }, []);

  const handleResendCode = async () => {
    if (!userEmail || !canResend) return
    if (!userEmail || !canResend) return;

    try {
      await resendVerificationMutation.mutateAsync({ email: userEmail })
      await resendVerificationMutation.mutateAsync({ email: userEmail });

      toast({
        title: "✅ Code Resent Successfully",
        description: "A new verification code has been sent to your email.",
        duration: 3000,
      })
      });

      setResendTimer(60)
      setCanResend(false)
      setResendTimer(60);
      setCanResend(false);
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to resend verification code.",
        duration: 3000,
      })
      });
    }
  }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        }
      );

      const data = await res.json()
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Verification failed.")
        throw new Error(data.message || "Verification failed.");
      }

      toast({
        title: "✅ Verified Successfully",
        description: "Your email has been verified. Redirecting to your feed...",
        description:
          "Your email has been verified. Redirecting to your feed...",
        duration: 3000,
      })
      });

      setCode("")
      setTimeout(() => router.push("/feed"), 2500)
      setCode("");
      setTimeout(() => router.push("/feed"), 2500);
    } catch (err: any) {
      setError(err.message || "An error occurred during verification.")
      setError(err.message || "An error occurred during verification.");
    } finally {
      setLoading(false)
      setLoading(false);
    }
  }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10">
@@ -127,7 +131,10 @@ export default function VerifyEmailPage() {
        className="w-full max-w-md space-y-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
      >
        <div>
          <label htmlFor="code" className="mb-2 block text-sm font-medium text-gray-700">
          <label
            htmlFor="code"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Verification Code
          </label>
          <Input
@@ -160,15 +167,15 @@ export default function VerifyEmailPage() {
              onClick={handleResendCode}
              disabled={resendVerificationMutation.isPending}
            >
              {resendVerificationMutation.isPending ? "Sending..." : "Resend Code"}
              {resendVerificationMutation.isPending
                ? "Sending..."
                : "Resend Code"}
            </button>
          ) : (
            <span className="text-gray-500">
              Resend in ({resendTimer}s)
            </span>
            <span className="text-gray-500">Resend in ({resendTimer}s)</span>
          )}
        </div>
      </form>
    </div>
  )
  );
}
‎frontend/components/profile/edit-profile-form.tsx‎
+137
-106
Lines changed: 137 additions & 106 deletions
Large diffs are not rendered by default.
‎frontend/hooks/profile.ts‎
+59
-86
Lines changed: 59 additions & 86 deletions
Original file line number	Diff line number	Diff line change
@@ -1,35 +1,34 @@
import { useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateUserProfile,
  fetchUserProfile,
  changeUserPassword,
  deleteUser,
  updateAvatar,
  updatePhone,
} from "@/api/services/profile"
} from "@/api/services/profile";
import type {
  UserProfile,
  UpdateProfileData,
  ChangePasswordData,
} from "@/types/profile"
import { useAppStore } from "@/store/store"
} from "@/types/profile";
import { useAppStore } from "@/store/store";

const normalizeProfile = (
  profile?: Partial<UserProfile> | null
): UserProfile | undefined => {
  if (!profile) return undefined
  if (!profile) return undefined;

  const phone = "phone" in profile ? profile.phone : undefined
  const phoneNumber = (profile as Partial<UserProfile>).phoneNumber ?? phone
  const phone = "phone" in profile ? profile.phone : undefined;
  const phoneNumber = (profile as Partial<UserProfile>).phoneNumber ?? phone;

  const rawAvatar = (profile as Partial<UserProfile>).avatar
  let avatar: UserProfile["avatar"] = null
  const rawAvatar = (profile as Partial<UserProfile>).avatar;
  let avatar: UserProfile["avatar"] = null;

  if (rawAvatar && typeof rawAvatar === "object") {
    avatar = rawAvatar as UserProfile["avatar"]
    avatar = rawAvatar as UserProfile["avatar"];
  } else if (typeof rawAvatar === "string") {
    avatar = { id: "", url: rawAvatar }
    avatar = { id: "", url: rawAvatar };
  }

  return {
@@ -40,23 +39,26 @@ const normalizeProfile = (
    createdAt: (profile as Partial<UserProfile>).createdAt ?? "",
    updatedAt: (profile as Partial<UserProfile>).updatedAt ?? "",
    lastLogin: (profile as Partial<UserProfile>).lastLogin ?? "",
  } as UserProfile
}
  } as UserProfile;
};

export const useFetchProfile = () => {
  const { user } = useAppStore()
  const hasHydrated = useAppStore((s) => s.hasHydrated)
  const { user } = useAppStore();
  const hasHydrated = useAppStore((s) => s.hasHydrated);

  const placeholder = useMemo(
    () => normalizeProfile(user as Partial<UserProfile>),
    [user]
  )
  );

  return useQuery<UserProfile, Error>({
    queryKey: ["profile"],
    queryFn: async ({ signal }) => {
      const profile = await fetchUserProfile({ signal })
      return normalizeProfile({ ...profile, token: user?.token }) as UserProfile
      const profile = await fetchUserProfile({ signal });
      return normalizeProfile({
        ...profile,
        token: user?.token,
      }) as UserProfile;
    },
    enabled: hasHydrated && !!user?.token,
    retry: 1,
@@ -66,20 +68,25 @@ export const useFetchProfile = () => {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: placeholder ? () => placeholder : undefined,
  })
}
  });
};

export const useUpdateProfile = () => {
  const qc = useQueryClient()
  const { setUser, user } = useAppStore()
  
  return useMutation<UserProfile, Error, UpdateProfileData>({
    mutationFn: updateUserProfile,
  const qc = useQueryClient();
  const { setUser, user } = useAppStore();
  return useMutation<
    UserProfile,
    Error,
    { payload: UpdateProfileData; avatarFile?: File }
  >({
    mutationFn: ({ payload, avatarFile }) =>
      updateUserProfile(payload, avatarFile),
    onSuccess: (updatedProfile) => {
      const normalized = normalizeProfile({
        ...updatedProfile,
        token: user?.token,
      })
      });

      if (normalized) {
        // ✅ Update Zustand store with complete updated profile (saves to localStorage)
@@ -90,101 +97,67 @@ export const useUpdateProfile = () => {
          phone: normalized.phone,
          avatar: normalized.avatar,
          isVerified: normalized.isVerified,
        })
        });

        // ✅ Keep React Query cache in sync to avoid unnecessary refetches
        qc.setQueryData(["profile"], normalized)
        qc.setQueryData(["profile"], normalized);
      }
    },
    onError: (error) => {
      console.error("Profile update failed:", error)
      console.error("Profile update failed:", error);
    },
  })
}
  });
};

export const useChangePassword = () => {
  return useMutation<void, Error, ChangePasswordData>({
    mutationFn: changeUserPassword,
  })
}
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient()
  const { clearAll } = useAppStore()
  
  const qc = useQueryClient();
  const { clearAll } = useAppStore();
  return useMutation<void, Error, void>({
    mutationFn: deleteUser,
    onSuccess: () => {
      // ✅ Clear all queries and user data from Zustand store only
      qc.clear()
      clearAll()
      qc.clear();
      clearAll();
    },
    onError: (error) => {
      console.error("User deletion failed:", error)
      console.error("User deletion failed:", error);
    },
  })
}
// ✅ Hook for updating avatar
export const useUpdateAvatar = () => {
  const qc = useQueryClient()
  const { setUser, user } = useAppStore()
  
  return useMutation<UserProfile, Error, File>({
    mutationFn: updateAvatar,
    onSuccess: (updatedProfile) => {
      const normalized = normalizeProfile({
        ...updatedProfile,
        token: user?.token,
      })
      if (normalized) {
        if (user) {
          setUser({
            ...user,
            name: normalized.name,
            email: normalized.email,
            phone: normalized.phone,
            avatar: normalized.avatar,
            isVerified: normalized.isVerified,
          })
        }
        qc.setQueryData(["profile"], normalized)
      }
    },
    onError: (error) => {
      console.error("Avatar update failed:", error)
    },
  })
}
  });
};

// ✅ Hook for updating phone number
export const useUpdatePhone = () => {
  const qc = useQueryClient()
  const { setUser, user } = useAppStore()
  
  const qc = useQueryClient();
  const { setUser, user } = useAppStore();
  return useMutation<UserProfile, Error, string>({
    mutationFn: updatePhone,
    onSuccess: (updatedProfile) => {
      const normalized = normalizeProfile({
        ...updatedProfile,
        token: user?.token,
      })
      });

      if (normalized) {
        if (user) {
          setUser({
            ...user,
            phone: normalized.phone,
          })
          });
        }

        qc.setQueryData(["profile"], normalized)
        qc.setQueryData(["profile"], normalized);
      }
    },
    onError: (error) => {
      console.error("Phone update failed:", error)
      console.error("Phone update failed:", error);
    },
  })
}
  });
};
0 commit comments
Comments
0
 (0)
Comment
You're not receiving notifications from this thread.

Copied!3 files remain