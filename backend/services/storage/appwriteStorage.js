import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import os from "os";
import path from "path";
import { ID } from "node-appwrite";
import FormData from "form-data";
import axios from "axios";
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
		this.endpoint = APPWRITE_ENDPOINT;
		this.projectId = APPWRITE_PROJECT_ID;
		this.apiKey = APPWRITE_API_KEY;
	}

	async uploadFile(file, folder = "general") {
		if (!file || !file.buffer) {
			throw new Error("File not provided or invalid format");
		}

		try {
                        const uploadsDir = path.join(os.tmpdir(), "uploads");
			if (!fs.existsSync(uploadsDir)) {
				await fs.promises.mkdir(uploadsDir, { recursive: true });
			}

			const uniqueId = ID.unique();
			const filename = `${Date.now()}_${file.originalname || "file"}`;
			const filePath = path.join(uploadsDir, filename);

			// Vaqtinchalik saqlash
			await fs.promises.writeFile(filePath, file.buffer);

			const form = new FormData();
			form.append("fileId", uniqueId);
			form.append("file", fs.createReadStream(filePath));

			const { data } = await axios.post(
				`${this.endpoint}/storage/buckets/${this.bucketId}/files`,
				form,
				{
					headers: {
						...form.getHeaders(),
						"X-Appwrite-Project": this.projectId,
						"X-Appwrite-Key": this.apiKey
					}
				}
			);

			// Vaqtinchalik faylni o'chirish
			await fs.promises.unlink(filePath).catch(() => {});

			const url = this._buildViewUrl(data.$id);
			return {
				id: data.$id,
				url,
				name: filename,
				mimeType: file.mimetype,
				size: file.size,
			};
		} catch (error) {
			console.error("Appwrite upload error:", error);
			throw new Error(`Failed to upload file: ${error.message}`);
		}
	}

	async deleteFile(fileId) {
		try {
			await axios.delete(
				`${this.endpoint}/storage/buckets/${this.bucketId}/files/${fileId}`,
				{
					headers: {
						"X-Appwrite-Project": this.projectId,
						"X-Appwrite-Key": this.apiKey
					}
				}
			);
		} catch (error) {
			console.error("Appwrite delete error:", error);
			throw new Error(`Failed to delete file: ${error.message}`);
		}
	}

	async getFileUrl(fileId) {
		return this._buildViewUrl(fileId);
	}

	_buildViewUrl(fileId) {
		return `${this.endpoint}/storage/buckets/${this.bucketId}/files/${fileId}/view?project=${this.projectId}`;
	}
}

