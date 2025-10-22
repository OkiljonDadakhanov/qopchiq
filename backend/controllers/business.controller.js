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

    // Avatar faylini olish (agar yuklangan bo'lsa)
    const avatarFile = req.file || null;

    // Hujjat fayllarini olish (agar yuklangan bo'lsa)
    const documentFiles = req.files ? req.files : [];

    const business = await BusinessService.updateProfile(
      req.userId,
      data,
      avatarFile,
      documentFiles
    );
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
