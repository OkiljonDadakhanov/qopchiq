import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {type: String, required: true, unique: true},
		password: {type: String, required: true},
		name: {type: String, required: true},
		phone: { type: String, default: null },
		avatar: { type: String, default: null },
		lastLogin: {type: Date, default: Date.now},
		isVerified: {type: Boolean, default: false},
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
		verificationAttempts: { type: Number, default: 0 },
		lastVerificationSentAt: { type: Date },
		dailyVerificationSentCount: { type: Number, default: 0 },
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
