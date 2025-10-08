import dotenv from "dotenv";
dotenv.config();

import BaseError from "../errors/base.error.js";
import AuthService from "../services/auth.service.js";
import { setRefreshTokenCookie } from "../utils/cookies.js";

export const signup = async (req, res, next) => {
	try {
		const { email, password, name } = req.body;
		const data = await AuthService.signup(email, password, name);
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
		// auto-login: set refreshToken cookie, but do not expose it in body
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

export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// Build reset URL with a safe fallback for CLIENT_URL to avoid 'undefined' in emails
		const CLIENT_URL = process.env.CLIENT_URL;
		const resetPath = `/reset-password/${resetToken}`;
		// Ensure we produce a proper absolute URL even if CLIENT_URL has trailing slash
		const resetURL = `${CLIENT_URL.replace(/\/$/, '')}${resetPath}`;
		console.log("Password reset URL (sent in email):", resetURL);

		// send email
		await sendPasswordResetEmail(user.email, resetURL);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
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
