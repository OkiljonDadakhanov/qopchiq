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
                const business = await BusinessService.updateProfile(req.userId, req.body);
                return res.json({ success: true, business });
        } catch (error) {
                return next(error);
        }
};

export const updateField = async (req, res, next) => {
        try {
                const { key } = req.params;
                const { value } = req.body;

                if (value === undefined) {
                        throw BaseError.BadRequestError("Value is required");
                }

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
                const business = await BusinessService.updateLocation(req.userId, coordinates);
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
                const result = await BusinessService.changePassword(req.userId, currentPassword, newPassword);
                return res.json(result);
        } catch (error) {
                return next(error);
        }
};

export const listBranches = async (req, res, next) => {
        try {
                const branches = await BusinessService.listBranches(req.userId);
                return res.json({ success: true, branches });
        } catch (error) {
                return next(error);
        }
};

export const createBranch = async (req, res, next) => {
        try {
                const business = await BusinessService.createBranch(req.userId, req.body);
                return res.status(201).json({ success: true, business });
        } catch (error) {
                return next(error);
        }
};

export const updateBranch = async (req, res, next) => {
        try {
                const { branchId } = req.params;
                const business = await BusinessService.updateBranch(req.userId, branchId, req.body);
                return res.json({ success: true, business });
        } catch (error) {
                return next(error);
        }
};

export const removeBranch = async (req, res, next) => {
        try {
                const { branchId } = req.params;
                const business = await BusinessService.removeBranch(req.userId, branchId);
                return res.json({ success: true, business });
        } catch (error) {
                return next(error);
        }
};
