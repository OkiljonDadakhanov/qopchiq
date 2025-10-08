import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
		refreshToken: { type: String, required: true, index: true, unique: true },
		userAgent: { type: String },
		ip: { type: String },
		expiresAt: { type: Date },
	},
	{ timestamps: true }
);

export const Token = mongoose.model("Token", tokenSchema);


