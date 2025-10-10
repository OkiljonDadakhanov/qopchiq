export default class UserDto {
	constructor(userDoc) {
		this.id = userDoc._id?.toString?.() ?? userDoc.id;
		this.email = userDoc.email;
		this.name = userDoc.name ?? userDoc.userName;
		this.phone = userDoc.phone ?? userDoc.phoneNumber;
		this.avatar = userDoc.avatar ?? userDoc.avatarUrl;
		this.isVerified = Boolean(userDoc.isVerified ?? userDoc.isActivated);
		this.createdAt = userDoc.createdAt;
		this.updatedAt = userDoc.updatedAt;
		this.lastLogin = userDoc.lastLogin;

		// Faqat dev/testda yoki maxsus flag yoqilganda diagnostika ma'lumotlari
		if (process.env.EXPOSE_VERIFICATION_DATA === "true" && userDoc.verificationToken) {
			this.verificationToken = userDoc.verificationToken;
			this.verificationTokenExpiresAt = userDoc.verificationTokenExpiresAt;
		}
	}
}


