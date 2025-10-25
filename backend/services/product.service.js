import mongoose from "mongoose";
import Product from "../models/product.model.js";
import BaseError from "../errors/base.error.js";

const create = async (data) => {
        if (!data.business || !mongoose.Types.ObjectId.isValid(data.business)) {
                throw BaseError.BadRequestError("Valid business id is required");
        }

        if (!data.title) {
                throw BaseError.BadRequestError("Product title is required");
        }

        if (data.category && !mongoose.Types.ObjectId.isValid(data.category)) {
                throw BaseError.BadRequestError("Invalid category id");
        }

        const doc = new Product({
                ...data,
                status: data.status || "available",
        });
        return await doc.save();
};

const getAll = async (query = {}) => {
        const page = parseInt(query.page) || 1;
        const limit = Math.min(parseInt(query.limit) || 50, 200);
        const filter = {};

        // Category filtering - support single category or multiple categories
        if (query.category) {
                if (Array.isArray(query.category)) {
                        // Multiple categories
                        const validCategories = query.category.filter(cat => 
                                mongoose.Types.ObjectId.isValid(cat)
                        );
                        if (validCategories.length > 0) {
                                filter.category = { $in: validCategories };
                        }
                } else if (mongoose.Types.ObjectId.isValid(query.category)) {
                        // Single category
                        filter.category = query.category;
                }
        }

        // Categories filtering (alternative parameter name)
        if (query.categories) {
                const categories = Array.isArray(query.categories) 
                        ? query.categories 
                        : query.categories.split(',');
                const validCategories = categories.filter(cat => 
                        mongoose.Types.ObjectId.isValid(cat)
                );
                if (validCategories.length > 0) {
                        filter.category = { $in: validCategories };
                }
        }

        if (query.business && mongoose.Types.ObjectId.isValid(query.business)) {
                filter.business = query.business;
        }

        if (query.status) {
                filter.status = query.status;
        } else if (!query.includeInactive) {
                filter.status = "available";
        }

        // Price range filtering
        if (query.minPrice) {
                filter.discountPrice = { ...filter.discountPrice, $gte: parseFloat(query.minPrice) };
        }
        if (query.maxPrice) {
                filter.discountPrice = { ...filter.discountPrice, $lte: parseFloat(query.maxPrice) };
        }

        // Search by title or description
        if (query.search) {
                filter.$or = [
                        { title: { $regex: query.search, $options: 'i' } },
                        { description: { $regex: query.search, $options: 'i' } }
                ];
        }

        return await Product.find(filter)
                .populate("category")
                .populate({ path: "business", select: "name avatar avatarFileId address" })
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
};

const getById = async (id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        return await Product.findById(id)
                .populate("category")
                .populate({ path: "business", select: "name avatar avatarFileId address" })
                .exec();
};

const update = async (id, data) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
                throw BaseError.BadRequestError("Invalid product id");
        }
        const updateData = { ...data, updatedAt: new Date() };
        return await Product.findByIdAndUpdate(id, updateData, { new: true })
                .populate("category")
                .populate({ path: "business", select: "name avatar avatarFileId address" })
                .exec();
};

const updateOwned = async (id, businessId, data) => {
        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(businessId)) {
                throw BaseError.BadRequestError("Invalid product id or business id");
        }
        const updateData = { ...data, updatedAt: new Date() };
        const product = await Product.findOneAndUpdate(
                { _id: id, business: businessId },
                updateData,
                { new: true }
        )
                .populate("category")
                .populate({ path: "business", select: "name avatar avatarFileId address" })
                .exec();
        if (!product) {
                throw BaseError.NotFoundError("Product not found");
        }
        return product;
};

const remove = async (id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
                throw BaseError.BadRequestError("Invalid product id");
        }
        return await Product.findByIdAndDelete(id).exec();
};

const removeOwned = async (id, businessId) => {
        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(businessId)) {
                throw BaseError.BadRequestError("Invalid product id or business id");
        }
        const product = await Product.findOneAndDelete({ _id: id, business: businessId }).exec();
        if (!product) {
                throw BaseError.NotFoundError("Product not found");
        }
        return product;
};

const getByBusiness = async (businessId, query = {}) => {
        if (!mongoose.Types.ObjectId.isValid(businessId)) return [];
        const page = parseInt(query.page) || 1;
        const limit = Math.min(parseInt(query.limit) || 50, 200);
        const filter = { business: businessId };
        if (query.status) filter.status = query.status;
        return await Product.find(filter)
                .populate("category")
                .populate({ path: "business", select: "name avatar avatarFileId address" })
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec();
};

export default {
        create,
        getAll,
        getById,
        update,
        updateOwned,
        remove,
        removeOwned,
        getByBusiness,
};
