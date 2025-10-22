import dotenv from "dotenv";
dotenv.config();

import bcryptjs from "bcryptjs";
import crypto from "crypto";

import UserDto from "../dtos/user.dto.js";
import BusinessDto from "../dtos/business.dto.js";
import { User } from "../models/user.model.js";
import { Business } from "../models/bussiness.model.js";
import BaseError from "../errors/base.error.js";
import MailService from "./mail.service.js";
import TokenService from "./token.service.js";

class AuthService {
	async signup(email, password, name, phone, avatar) {
		if (!email || !password || !name) {
			throw BaseError.BadRequestError("All fields are required");
		}

		const userAlreadyExists = await User.findOne({ email });
		if (userAlreadyExists) {
			throw BaseError.BadRequestError("User already exists");
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

		const user = new User({
			email,
			password: hashedPassword,
			name,
			phone,
			avatar,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + (Number(process.env.VERIFICATION_TTL_MINUTES || 10) * 60 * 1000),
			lastVerificationSentAt: new Date(),
			dailyVerificationSentCount: 1,
		});

		await user.save();

		await MailService.sendVerificationEmail(user.email, verificationToken);

		const userDto = new UserDto(user);
		const { accessToken, refreshToken } = TokenService.generateToken({ id: user._id, email: user.email });
		await TokenService.saveToken(user._id, refreshToken);
		return { user: userDto, accessToken, refreshToken };
	}

	async businessSignup(email, password, name, phoneNumber, description, address, businessType) {
		if (!email || !password || !name) {
			throw BaseError.BadRequestError("Email, password and name are required");
		}

		// User va Business email'larini tekshirish
		const userExists = await User.findOne({ email });
		const businessExists = await Business.findOne({ email });
		
		if (userExists || businessExists) {
			throw BaseError.BadRequestError("Email already exists");
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

		const business = new Business({
			email,
			password: hashedPassword,
			name,
			phoneNumber,
			description,
			address,
			businessType,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + (Number(process.env.VERIFICATION_TTL_MINUTES || 10) * 60 * 1000),
			lastVerificationSentAt: new Date(),
			dailyVerificationSentCount: 1,
		});

		await business.save();

		await MailService.sendVerificationEmail(business.email, verificationToken);

		const businessDto = new BusinessDto(business);
		const { accessToken, refreshToken } = TokenService.generateToken({ id: business._id, email: business.email });
		await TokenService.saveToken(business._id, refreshToken);
		return { business: businessDto, accessToken, refreshToken };
	}

	async verifyEmail(code) {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});
		if (!user) {
			throw BaseError.BadRequestError("Invalid or expired verification code");
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		user.verificationAttempts = 0;
		await user.save();
		await MailService.sendWelcomeEmail(user.email, user.name);

		const userDto = new UserDto(user);
		const { accessToken, refreshToken } = TokenService.generateToken({ id: user._id, email: user.email });

		await TokenService.saveToken(user._id, refreshToken);

		return { user: userDto, accessToken, refreshToken };
	}

	async resendVerification(email) {
		const user = await User.findOne({ email });
		if (!user) throw BaseError.BadRequestError("User not found");
		if (user.isVerified) throw BaseError.BadRequestError("User already verified");

		const cooldownSec = Number(process.env.VERIFICATION_RESEND_COOLDOWN_SECONDS || 60);
		const dailyLimit = Number(process.env.VERIFICATION_DAILY_RESEND_LIMIT || 5);

		if (user.lastVerificationSentAt && (Date.now() - user.lastVerificationSentAt.getTime()) < cooldownSec * 1000) {
			throw BaseError.BadRequestError("Please wait before requesting a new code");
		}

		// reset daily counter if day changed
		const now = new Date();
		const last = user.lastVerificationSentAt;
		if (!last || last.toDateString() !== now.toDateString()) {
			user.dailyVerificationSentCount = 0;
		}
		if (user.dailyVerificationSentCount >= dailyLimit) {
			throw BaseError.BadRequestError("Daily resend limit reached");
		}

		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
		user.verificationToken = verificationToken;
		user.verificationTokenExpiresAt = Date.now() + (Number(process.env.VERIFICATION_TTL_MINUTES || 10) * 60 * 1000);
		user.lastVerificationSentAt = now;
		user.dailyVerificationSentCount += 1;
		await user.save();

		await MailService.sendVerificationEmail(user.email, verificationToken);
		return { success: true };
	}

	async refresh(oldRefreshToken) {
		const payload = TokenService.validateRefreshToken(oldRefreshToken);
		if (!payload) throw BaseError.UnauthorizedError("Invalid refresh token");
		const newRefreshToken = await TokenService.rotateToken(oldRefreshToken, { id: payload.id, email: payload.email });
		const accessToken = TokenService.generateAccessToken({ id: payload.id, email: payload.email });
		return { accessToken, refreshToken: newRefreshToken };
	}

	async logout(refreshToken) {
		if (!refreshToken) return;
		await TokenService.removeToken(refreshToken);
	}

	async login(email, password) {
		const user = await User.findOne({ email });
		if (!user) throw BaseError.BadRequestError("Invalid credentials");

		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) throw BaseError.BadRequestError("Invalid credentials");

		user.lastLogin = new Date();
		await user.save();

		const userDto = new UserDto(user);
		const { accessToken, refreshToken } = TokenService.generateToken({ id: user._id, email: user.email });
		await TokenService.saveToken(user._id, refreshToken);
		return { user: userDto, accessToken, refreshToken };
	}

	async businessLogin(email, password) {
		const business = await Business.findOne({ email });
		if (!business) throw BaseError.BadRequestError("Invalid credentials");

		const isPasswordValid = await bcryptjs.compare(password, business.password);
		if (!isPasswordValid) throw BaseError.BadRequestError("Invalid credentials");

		business.lastLogin = new Date();
		await business.save();

		const businessDto = new BusinessDto(business);
		const { accessToken, refreshToken } = TokenService.generateToken({ id: business._id, email: business.email });
		await TokenService.saveToken(business._id, refreshToken);
		return { business: businessDto, accessToken, refreshToken };
	}

	async forgotPassword(email) {
		if (!email) throw BaseError.BadRequestError("Email is required");
		const user = await User.findOne({ email });
		if (!user) throw BaseError.BadRequestError("User not found");

		const resetToken = crypto.randomBytes(20).toString("hex");
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = Date.now() + 60 * 60 * 1000;
		await user.save();

		await MailService.sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
		return { success: true };
	}

	async resetPassword(token, password) {
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});
		if (!user) throw BaseError.BadRequestError("Invalid or expired reset token");

		const hashedPassword = await bcryptjs.hash(password, 10);
		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await MailService.sendResetSuccessEmail(user.email);
		return { success: true };
	}
}

export default new AuthService();