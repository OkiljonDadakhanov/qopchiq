import BusinessService from "../services/business.service.js";
import BaseError from "../errors/base.error.js";

export const getMe = async (req, res, next) => {
  try {
    if (req.userType !== "business") {
      throw BaseError.ForbiddenError("Business access required");
    }
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
    if (req.body.description) data.description = req.body.description;
    if (req.body.address) data.address = req.body.address;
    if (req.body.businessType) data.businessType = req.body.businessType;

    // Locationni tekshirish
    if (req.body.longitude && req.body.latitude) {
      data.longitude = parseFloat(req.body.longitude);
      data.latitude = parseFloat(req.body.latitude);
    }

    // Avatar va dokumentlarni olish
    const avatarFile = req.files?.avatar?.[0] || null;
    const documentFiles = req.files?.documents || [];

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
