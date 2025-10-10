import fs from "fs";
import path from "path";
import { Client, Storage, ID } from "node-appwrite";
import FileStorage from "./fileStorage.js";

export default class AppwriteStorage extends FileStorage {
	constructor() {
		super();
		const { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY, APPWRITE_BUCKET_ID } = process.env;
		if (!APPWRITE_ENDPOINT) throw new Error("APPWRITE_ENDPOINT is required");
		if (!APPWRITE_PROJECT_ID) throw new Error("APPWRITE_PROJECT_ID is required");
		if (!APPWRITE_API_KEY) throw new Error("APPWRITE_API_KEY is required");
		if (!APPWRITE_BUCKET_ID) throw new Error("APPWRITE_BUCKET_ID is required");

		this.bucketId = APPWRITE_BUCKET_ID;
		this.client = new Client()
			.setEndpoint(APPWRITE_ENDPOINT)
			.setProject(APPWRITE_PROJECT_ID)
			.setKey(APPWRITE_API_KEY);
		this.storage = new Storage(this.client);
	}

	async uploadFile(file, folder = "general") {
		if (!file || !file.buffer) {
			throw new Error("File not provided or invalid format");
		}

		const uploadsDir = path.join(process.cwd(), "uploads", folder);
		if (!fs.existsSync(uploadsDir)) {
			await fs.promises.mkdir(uploadsDir, { recursive: true });
		}

		const uniqueId = ID.unique();
		const filename = `${Date.now()}_${file.originalname || "file"}`;
		const filePath = path.join(uploadsDir, filename);

		await fs.promises.writeFile(filePath, file.buffer);

		try {
			const created = await this.storage.createFile(this.bucketId, uniqueId, fs.createReadStream(filePath));
			const url = this._buildViewUrl(created.$id);
			return {
				id: created.$id,
				url,
				name: filename,
				mimeType: file.mimetype,
				size: file.size,
			};
		} finally {
			await fs.promises.unlink(filePath).catch(() => {});
		}
	}

	async deleteFile(fileId) {
		await this.storage.deleteFile(this.bucketId, fileId);
	}

	async getFileUrl(fileId) {
		return this._buildViewUrl(fileId);
	}

	_buildViewUrl(fileId) {
		const { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } = process.env;
		return `${APPWRITE_ENDPOINT}/storage/buckets/${this.bucketId}/files/${fileId}/view?project=${APPWRITE_PROJECT_ID}`;
	}
}

