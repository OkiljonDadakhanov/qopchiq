import ProductService from "../services/product.service.js";
import FileService from "../services/file.service.js";

export const createProduct = async (req, res, next) => {
    try {
        // req is expected to be multipart/form-data when files are present
        // Clone body and normalize some fields
        const body = { ...req.body };

        // If client sent quantity as JSON string, try to parse it
        if (body.quantity && typeof body.quantity === 'string') {
            try { body.quantity = JSON.parse(body.quantity); } catch (e) { /* leave as string */ }
        }

        // Handle uploaded files (multer stores files in memory)
        if (req.files && req.files.length) {
            const uploaded = [];
            for (const file of req.files) {
                const result = await FileService.uploadFile(file, 'products');
                if (result && result.success && result.fileUrl) uploaded.push(result.fileUrl);
                else if (result && result.fileId) uploaded.push(result.fileUrl || result.fileId);
                else {
                    // continue on error for single file but log it
                    console.warn('File upload failed for product image:', result && result.error);
                }
            }
            body.images = uploaded;
        } else if (body.images && typeof body.images === 'string') {
            // client may send images as JSON string
            try { body.images = JSON.parse(body.images); } catch (e) { /* keep as-is */ }
        }

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
        return res.json({ success: true, product });
    } catch (error) {
        return next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const body = { ...req.body };

        if (body.quantity && typeof body.quantity === 'string') {
            try { body.quantity = JSON.parse(body.quantity); } catch (e) { /* leave as string */ }
        }

        if (req.files && req.files.length) {
            const uploaded = [];
            for (const file of req.files) {
                const result = await FileService.uploadFile(file, 'products');
                if (result && result.success && result.fileUrl) uploaded.push(result.fileUrl);
                else if (result && result.fileId) uploaded.push(result.fileUrl || result.fileId);
                else console.warn('File upload failed for product image:', result && result.error);
            }
            // If client wants to replace images fully, they can send replaceImages=true
            if (req.body.replaceImages === 'true' || req.body.replaceImages === true) {
                body.images = uploaded;
            } else {
                // append to existing images array
                body.images = Array.isArray(body.images) ? body.images.concat(uploaded) : (body.images ? [body.images].concat(uploaded) : uploaded);
            }
        } else if (body.images && typeof body.images === 'string') {
            try { body.images = JSON.parse(body.images); } catch (e) { /* keep as-is */ }
        }

        const product = await ProductService.update(req.params.id, body);
        return res.json({ success: true, product });
    } catch (error) {
        return next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        await ProductService.remove(req.params.id);
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