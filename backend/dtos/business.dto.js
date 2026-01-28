const buildDocumentUrl = (fileId) => {
        if (!process.env.APPWRITE_ENDPOINT || !process.env.APPWRITE_BUCKET_ID || !process.env.APPWRITE_PROJECT_ID) {
                return null;
        }
        return `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${fileId}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
};

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
                this.location = business.location;
                this.documents = Array.isArray(business.documents)
                        ? business.documents.map((docId) => ({
                                  id: docId,
                                  url: buildDocumentUrl(docId),
                          }))
                        : [];
                this.branches = Array.isArray(business.branches)
                        ? business.branches.map((branch) => ({
                                  id: branch._id,
                                  name: branch.name,
                                  address: branch.address,
                                  phoneNumber: branch.phoneNumber,
                                  location: branch.location,
                                  isActive: branch.isActive,
                                  createdAt: branch.createdAt,
                                  updatedAt: branch.updatedAt,
                          }))
                        : [];
                this.lastLogin = business.lastLogin;
                this.isVerified = business.isVerified;
                this.isApproved = business.isApproved;
                this.createdAt = business.createdAt;
                this.updatedAt = business.updatedAt;

                if (process.env.EXPOSE_VERIFICATION_DATA === "true") {
                        this.verificationToken = business.verificationToken;
                        this.verificationTokenExpiresAt = business.verificationTokenExpiresAt;
                }
        }
}
