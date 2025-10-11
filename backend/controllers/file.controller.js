import storage from "../services/storage/storageFactory.js";

export const uploadFile = async (req, res) => {
	try {
		const file = req.file;
		const result = await storage.uploadFile(file, req.body.folder || "uploads");
		return res.json({ success: true, file: result });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

export const deleteFile = async (req, res) => {
	try {
		const { id } = req.params;
		await storage.deleteFile(id);
		return res.json({ success: true });
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

