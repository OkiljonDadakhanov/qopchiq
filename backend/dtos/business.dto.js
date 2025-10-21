export default class BusinessDto {
  constructor(business) {
    this.id = business._id;
    this.name = business.name;
    this.email = business.email;
    this.phoneNumber = business.phoneNumber;
    this.description = business.description;
    this.avatar = business.avatar
      ? {
          id: business.avatarFileId,
          url: business.avatar,
        }
      : null;
    this.address = business.address;
    this.businessType = business.businessType;
    this.location = business.location;
    this.documents = business.documents
      ? business.documents.map((docId) => ({
          id: docId,
          url: `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${docId}/view?project=${process.env.APPWRITE_PROJECT_ID}`,
        }))
      : [];
    this.lastLogin = business.lastLogin;
    this.isVerified = business.isVerified;
    this.isApproved = business.isApproved;
    this.createdAt = business.createdAt;
    this.updatedAt = business.updatedAt;

    // Agar verification ma'lumotlari kerak bo'lsa
    if (process.env.EXPOSE_VERIFICATION_DATA === "true") {
      this.verificationToken = business.verificationToken;
      this.verificationTokenExpiresAt = business.verificationTokenExpiresAt;
    }
  }
}
