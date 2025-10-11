import StorageService from "../services/storage.service.js";
import BaseError from "../errors/base.error.js";

export const uploadFile = async (req, res, next) => {
	try {
		const { folder = "general" } = req.query;
		const file = req.file;

		if (!file) {
			throw BaseError.BadRequestError("Fayl yuborilmagan");
		}

		const result = await StorageService.uploadFile(file, folder);

		return res.json({
			success: true,
			file: {
				id: result.id,
				url: result.url,
				name: result.name,
				size: result.size,
				mimeType: result.mimeType,
			},
		});
	} catch (error) {
		return next(error);
	}
};

export const deleteFile = async (req, res, next) => {
	try {
		const { fileId } = req.params;

		if (!fileId) {
			throw BaseError.BadRequestError("File ID yuborilmagan");
		}

		await StorageService.deleteFile(fileId);

		return res.json({
			success: true,
			message: "Fayl muvaffaqiyatli o'chirildi",
		});
	} catch (error) {
		return next(error);
	}
};
