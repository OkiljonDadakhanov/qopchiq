import ProductService from "../services/product.service.js";
import FileService from "../services/file.service.js";
import BaseError from "../errors/base.error.js";

const parseQuantity = (quantity) => {
        if (!quantity) return undefined;
        if (typeof quantity === "string") {
                try {
                        return JSON.parse(quantity);
                } catch {
                        const amount = Number(quantity);
                        return Number.isFinite(amount) ? { amount, unit: "pcs" } : undefined;
                }
        }
        if (typeof quantity === "object" && quantity !== null) {
                const amount = Number(quantity.amount ?? quantity.quantity ?? 0);
                const unit = quantity.unit || "pcs";
                if (Number.isFinite(amount)) {
                        return { amount, unit };
                }
        }
        const amount = Number(quantity);
        return Number.isFinite(amount) ? { amount, unit: "pcs" } : undefined;
};

const normalizeNumericField = (value) => {
        if (value === undefined || value === null || value === "") return undefined;
        const num = Number(value);
        return Number.isFinite(num) ? num : undefined;
};

const extractImagesFromRequest = async (req) => {
        if (req.files && req.files.length) {
                const uploaded = [];
                for (const file of req.files) {
                        const result = await FileService.uploadFile(file, "products");
                        if (result?.success && result.fileUrl) {
                                uploaded.push(result.fileUrl);
                        } else if (result?.fileUrl) {
                                uploaded.push(result.fileUrl);
                        } else if (result?.fileId) {
                                uploaded.push(result.fileId);
                        }
                }
                return uploaded;
        }
        if (req.body.images) {
                if (typeof req.body.images === "string") {
                        try {
                                return JSON.parse(req.body.images);
                        } catch {
                                return Array.isArray(req.body.images) ? req.body.images : [req.body.images];
                        }
                }
                if (Array.isArray(req.body.images)) {
                        return req.body.images;
                }
        }
        return undefined;
};

export const createProduct = async (req, res, next) => {
        try {
                if (req.userType !== "business") {
                        throw BaseError.ForbiddenError("Only businesses can create products");
                }

                const body = { ...req.body };
                body.business = req.userId;

                const quantity = parseQuantity(body.quantity);
                if (quantity) body.quantity = quantity;

                const originalPrice = normalizeNumericField(body.originalPrice);
                if (originalPrice !== undefined) body.originalPrice = originalPrice;

                const discountPrice = normalizeNumericField(body.discountPrice ?? body.price);
                if (discountPrice !== undefined) body.discountPrice = discountPrice;

                const stock = normalizeNumericField(body.stock ?? quantity?.amount ?? body.quantity?.amount);
                if (stock !== undefined) body.stock = stock;

                if (!body.title && body.name) body.title = body.name;
                body.pickupStartTime = body.pickupStartTime || body.pickupStart || undefined;
                body.pickupEndTime = body.pickupEndTime || body.pickupEnd || undefined;

                const images = await extractImagesFromRequest(req);
                if (images) body.images = images;

                const product = await ProductService.create(body);
                return res.status(201).json({ success: true, product });
        } catch (error) {
                return next(error);
        }
};

export const getProducts = async (req, res, next) => {
        try {
                        const products = await ProductService.getAll(req.query);
                        return res.json({ success: true, products });
        } catch (error) {
                return next(error);
        }
};

export const getProduct = async (req, res, next) => {
        try {
                const product = await ProductService.getById(req.params.id);
                if (!product) throw BaseError.NotFoundError("Product not found");
                return res.json({ success: true, product });
        } catch (error) {
                return next(error);
        }
};

export const updateProduct = async (req, res, next) => {
        try {
                if (req.userType !== "business") {
                        throw BaseError.ForbiddenError("Only businesses can update products");
                }

                const body = { ...req.body };

                const quantity = parseQuantity(body.quantity);
                if (quantity) body.quantity = quantity;

                const originalPrice = normalizeNumericField(body.originalPrice);
                if (originalPrice !== undefined) body.originalPrice = originalPrice;

                const discountPrice = normalizeNumericField(body.discountPrice ?? body.price);
                if (discountPrice !== undefined) body.discountPrice = discountPrice;

                if (body.stock !== undefined) {
                        const stock = normalizeNumericField(body.stock);
                        if (stock !== undefined) body.stock = stock;
                }

                body.pickupStartTime = body.pickupStartTime || body.pickupStart || undefined;
                body.pickupEndTime = body.pickupEndTime || body.pickupEnd || undefined;

                let existingImages = [];
                if (body.existingImages) {
                        if (typeof body.existingImages === "string") {
                                try {
                                        existingImages = JSON.parse(body.existingImages);
                                } catch {
                                        existingImages = [body.existingImages];
                                }
                        } else if (Array.isArray(body.existingImages)) {
                                existingImages = body.existingImages;
                        }
                } else if (body.images && typeof body.images === "string") {
                        try {
                                existingImages = JSON.parse(body.images);
                        } catch {
                                existingImages = [body.images];
                        }
                } else if (Array.isArray(body.images)) {
                        existingImages = body.images;
                }

                const uploadedImages = await extractImagesFromRequest(req);
                if (uploadedImages) {
                        if (req.body.replaceImages === "true" || req.body.replaceImages === true) {
                                body.images = uploadedImages;
                        } else {
                                body.images = [...existingImages, ...uploadedImages];
                        }
                } else if (existingImages.length) {
                        body.images = existingImages;
                }

                const product = await ProductService.updateOwned(req.params.id, req.userId, body);
                return res.json({ success: true, product });
        } catch (error) {
                return next(error);
        }
};

export const deleteProduct = async (req, res, next) => {
        try {
                if (req.userType !== "business") {
                        throw BaseError.ForbiddenError("Only businesses can delete products");
                }

                await ProductService.removeOwned(req.params.id, req.userId);
                return res.json({ success: true });
        } catch (error) {
                return next(error);
        }
};

export const getProductsByBusiness = async (req, res, next) => {
        try {
                const products = await ProductService.getByBusiness(req.params.businessId, req.query);
                return res.json({ success: true, products });
        } catch (error) {
                return next(error);
        }
};

export const getMyProducts = async (req, res, next) => {
        try {
                if (req.userType !== "business") {
                        throw BaseError.ForbiddenError("Only businesses can access their products");
                }
                const products = await ProductService.getByBusiness(req.userId, req.query);
                return res.json({ success: true, products });
        } catch (error) {
                return next(error);
        }
};

export const updateProductStatus = async (req, res, next) => {
        try {
                if (req.userType !== "business") {
                        throw BaseError.ForbiddenError("Only businesses can update products");
                }
                const { status } = req.body;
                if (!status) throw BaseError.BadRequestError("Status is required");
                const product = await ProductService.updateOwned(req.params.id, req.userId, { status });
                return res.json({ success: true, product });
        } catch (error) {
                return next(error);
        }
};
