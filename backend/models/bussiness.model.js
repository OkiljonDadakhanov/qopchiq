import mongoose from "mongoose";

const bussinessSchema = new mongoose.Schema({
        name: {type: String,required: true},
		email: {type: String, required: true, unique: true},
		password: {type: String, required: true},
        phoneNumber: { type: String },
        description: { type: String },
        avatar:{type:String},
        address: { type: String },
        location: {
            type: { type: String, default: "Point" },
            coordinates: [Number],
	},
		bussinessType:{type: String},
        documents: [String],
		lastLogin: {type: Date,default: Date.now},
		isVerified: {type: Boolean, default: false},
        isApproved: { type: Boolean, default: false },
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

export const Business = mongoose.model("Business", bussinessSchema);