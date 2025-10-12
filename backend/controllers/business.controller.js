import BusinessService from "../services/business.service.js";
import BaseError from "../errors/base.error.js";
import upload from "../middlewares/upload.middleware.js";

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
		const business = await BusinessService.updateProfile(req.userId, req.body, req.file);
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

