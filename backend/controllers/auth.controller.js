import dotenv from "dotenv";
dotenv.config();

import AuthService from "../services/auth.service.js";
import { setRefreshTokenCookie } from "../utils/cookies.js";

export const signup = async (req, res, next) => {
	try {
		const { email, password, name, phone, avatar } = req.body;
		const data = await AuthService.signup(email, password, name, phone, avatar);
		setRefreshTokenCookie(res, data.refreshToken);
		return res.status(201).json({ success: true, message: "User created successfully", user: data.user, accessToken: data.accessToken });
	} catch (error) {
		return next(error);
	}
};

export const verifyEmail = async (req, res, next) => {
	try {
		const { code } = req.body;
		const data = await AuthService.verifyEmail(code);
		setRefreshTokenCookie(res, data.refreshToken);
		return res.status(200).json({ success: true, message: "Email verified successfully", user: data.user, accessToken: data.accessToken });
	} catch (error) {
		return next(error);
	}
};

export const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const data = await AuthService.login(email, password);
		setRefreshTokenCookie(res, data.refreshToken);
		return res.status(200).json({ success: true, message: "Logged in successfully", user: data.user, accessToken: data.accessToken });
	} catch (error) {
		return next(error);
	}
};

export const logout = async (req, res, next) => {
	try {
		const { refreshToken } = req.cookies || {};
		await AuthService.logout(refreshToken);
		res.clearCookie("refreshToken");
		return res.status(200).json({ success: true, message: "Logged out successfully" });
	} catch (error) {
		return next(error);
	}
};

export const forgotPassword = async (req, res, next) => {
	try {
		const { email } = req.body;
		await AuthService.forgotPassword(email);
		return res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		return next(error);
	}
};

export const resetPassword = async (req, res, next) => {
	try {
		const { token } = req.params;
		const { password } = req.body;
		await AuthService.resetPassword(token, password);
		return res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		return next(error);
	}
};

export const resendVerification = async (req, res, next) => {
	try {
		const { email } = req.body;
		await AuthService.resendVerification(email);
		return res.status(200).json({ success: true, message: "Verification code resent" });
	} catch (error) {
		return next(error);
	}
};

export const refresh = async (req, res, next) => {
	try {
		const { refreshToken } = req.cookies || {};
		const data = await AuthService.refresh(refreshToken);
		setRefreshTokenCookie(res, data.refreshToken);
		return res.status(200).json({ success: true, accessToken: data.accessToken });
	} catch (error) {
		return next(error);
	}
};
