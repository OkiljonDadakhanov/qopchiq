import AppwriteStorage from "./appwriteStorage.js";

const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || "appwrite";

let storage;
switch (STORAGE_PROVIDER) {
	case "appwrite":
		storage = new AppwriteStorage();
		break;
	default:
		throw new Error(`Unsupported storage provider: ${STORAGE_PROVIDER}`);
}

export default storage;

