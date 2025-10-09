import UserService from "../services/user.service.js";

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
		const user = await UserService.updateProfile(req.userId, req.body);
		return res.json({ success: true, user });
	} catch (error) {
		return next(error);
	}
};

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

export const deleteMe = async (req, res, next) => {
	try {
		await UserService.deleteMe(req.userId);
		return res.json({ success: true });
	} catch (error) {
		return next(error);
	}
};

export const updateAvatar = async (req, res, next) => {
	try {
		const user = await UserService.updateAvatar(req.userId, req.file);
		return res.json({ success: true, user });
	} catch (error) {
		return next(error);
	}
};


