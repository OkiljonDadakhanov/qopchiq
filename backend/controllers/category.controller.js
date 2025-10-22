import CategoryService from "../services/category.service.js";

export const createCategory = async (req, res, next) => {
    try {
        const category = await CategoryService.create(req.body);
        return res.status(201).json({ success: true, category });
    } catch (error) {
        return next(error);
    }
};

export const getCategories = async (req, res, next) => {
    try {
        const categories = await CategoryService.getAll(req.query);
        return res.json({ success: true, categories });
    } catch (error) {
        return next(error);
    }
};

export const getCategory = async (req, res, next) => {
    try {
        const category = await CategoryService.getById(req.params.id);
        return res.json({ success: true, category });
    } catch (error) {
        return next(error);
    }
};

export const updateCategory = async (req, res, next) => {
    try {
        const category = await CategoryService.update(req.params.id, req.body);
        return res.json({ success: true, category });
    } catch (error) {
        return next(error);
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        await CategoryService.remove(req.params.id);
        return res.json({ success: true });
    } catch (error) {
        return next(error);
    }
};