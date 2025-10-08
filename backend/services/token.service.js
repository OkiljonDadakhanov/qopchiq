import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { Token } from "../models/token.model.js";
import BaseError from "../errors/base.error.js";

class TokenService {
	generateToken(payload) {
		const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
		const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
		return { accessToken, refreshToken };
	}

	generateAccessToken(payload) {
		return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
	}

	validateAccessToken(token) {
		try {
			return jwt.verify(token, process.env.JWT_SECRET);
		} catch (e) {
			return null;
		}
	}

	validateRefreshToken(token) {
		try {
			return jwt.verify(token, process.env.JWT_SECRET);
		} catch (e) {
			return null;
		}
	}

	async saveToken(userId, refreshToken, meta = {}) {
		const existing = await Token.findOne({ user: userId, refreshToken });
		if (existing) return existing;
		const doc = await Token.create({ user: userId, refreshToken, userAgent: meta.userAgent, ip: meta.ip, expiresAt: meta.expiresAt });
		return doc;
	}

	async findToken(refreshToken) {
		return Token.findOne({ refreshToken });
	}

	async removeToken(refreshToken) {
		await Token.deleteOne({ refreshToken });
	}

	async revokeUserTokens(userId) {
		await Token.deleteMany({ user: userId });
	}

	async rotateToken(oldRefreshToken, payload, meta = {}) {
		const stored = await this.findToken(oldRefreshToken);
		if (!stored) throw BaseError.UnauthorizedError("Token not found in DB");
		await this.removeToken(oldRefreshToken);
		const { refreshToken } = this.generateToken(payload);
		await this.saveToken(payload.id || payload._id, refreshToken, meta);
		return refreshToken;
	}
}

export default new TokenService();


