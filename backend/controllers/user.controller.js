import UserService from "../services/user.service.js";
import upload from "../middlewares/upload.middleware.js";

export const getMe = async (req, res, next) => {
  try {
    const user = await UserService.getMe(req.userId);
    return res.json({ success: true, user });
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
    if (req.body.phone) data.phone = req.body.phone;

    // Avatar faylini olish (agar yuklangan bo'lsa)
    const avatarFile = req.file || null;

    const user = await UserService.updateProfile(req.userId, data, avatarFile);
    return res.json({ success: true, user });
  } catch (error) {
    return next(error);
  }
};

export const deleteMe = async (req, res, next) => {
  try {
    await UserService.deleteMe(req.userId);
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};
