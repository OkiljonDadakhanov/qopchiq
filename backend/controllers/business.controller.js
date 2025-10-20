import BusinessService from "../services/business.service.js";
import BaseError from "../errors/base.error.js";
import StorageService from "../services/storage.service.js";

export const getMe = async (req, res, next) => {
  try {
    const business = await BusinessService.getMe(req.userId);
    return res.json({ success: true, business });
  } catch (error) {
    return next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
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

      // Handle documents upload
      if (req.files.documents) {
        const documentFiles = Array.isArray(req.files.documents)
          ? req.files.documents
          : [req.files.documents];
        data.documents = [];

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
    return res.json({ success: true, business });
  } catch (error) {
    return next(error);
  }
};

export const updateField = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const business = await BusinessService.updateField(req.userId, key, value);
    return res.json({ success: true, business });
  } catch (error) {
    return next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const business = await BusinessService.updateAvatar(req.userId, avatar);
    return res.json({ success: true, business });
  } catch (error) {
    return next(error);
  }
};

export const updateLocation = async (req, res, next) => {
  try {
    const { coordinates } = req.body;
    const business = await BusinessService.updateLocation(
      req.userId,
      coordinates
    );
    return res.json({ success: true, business });
  } catch (error) {
    return next(error);
  }
};

export const addDocument = async (req, res, next) => {
  try {
    const { fileId } = req.body;
    const business = await BusinessService.addDocument(req.userId, fileId);
    return res.json({ success: true, business });
  } catch (error) {
    return next(error);
  }
};

export const removeDocument = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const business = await BusinessService.removeDocument(req.userId, fileId);
    return res.json({ success: true, business });
  } catch (error) {
    return next(error);
  }
};

export const deleteMe = async (req, res, next) => {
  try {
    const result = await BusinessService.deleteMe(req.userId);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await BusinessService.changePassword(
      req.userId,
      currentPassword,
      newPassword
    );
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};
