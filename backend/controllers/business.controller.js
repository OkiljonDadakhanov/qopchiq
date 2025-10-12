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
		const { longitude, latitude } = req.body;
		const locationCoordinates = longitude && latitude ? [parseFloat(longitude), parseFloat(latitude)] : null;
		const documentFiles = req.files ? Object.values(req.files).flat() : null;
		
		const business = await BusinessService.updateProfile(
			req.userId, 
			req.body, 
			req.file, // avatar file
			documentFiles, // document files
			locationCoordinates
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

