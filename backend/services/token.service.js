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
                const { ownerType = "User", userAgent, ip, expiresAt } = meta;
                const existing = await Token.findOne({ refreshToken });
                if (existing) {
                        if (!existing.userModel || existing.userModel !== ownerType || !existing.user?.equals?.(userId)) {
                                existing.user = userId;
                                existing.userModel = ownerType;
                        }
                        if (userAgent) existing.userAgent = userAgent;
                        if (ip) existing.ip = ip;
                        if (expiresAt) existing.expiresAt = expiresAt;
                        await existing.save();
                        return existing;
                }
                const doc = await Token.create({ user: userId, userModel: ownerType, refreshToken, userAgent, ip, expiresAt });
                return doc;
        }

	async findToken(refreshToken) {
		return Token.findOne({ refreshToken });
	}

	async removeToken(refreshToken) {
		await Token.deleteOne({ refreshToken });
	}

        async revokeUserTokens(userId, ownerType = "User") {
                await Token.deleteMany({ user: userId, userModel: ownerType });
        }

        async rotateToken(oldRefreshToken, payload, meta = {}) {
                const stored = await this.findToken(oldRefreshToken);
                if (!stored) throw BaseError.UnauthorizedError("Token not found in DB");
                await this.removeToken(oldRefreshToken);
                const { refreshToken } = this.generateToken(payload);
                const ownerType = meta.ownerType || stored.userModel || "User";
                await this.saveToken(payload.id || payload._id, refreshToken, { ...meta, ownerType });
                return refreshToken;
        }
}

export default new TokenService();


