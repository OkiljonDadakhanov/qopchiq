import Product from "../models/product.model.js";
import mongoose from "mongoose";

const create = async (data) => {
    // ensure business id is ObjectId
    if (data.business && !mongoose.Types.ObjectId.isValid(data.business)) {
        throw new Error("Invalid business id");
    }
    const product = new Product(data);
    return await product.save();
};

const getAll = async (query = {}) => {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 50, 200);
    const filter = {};
    if (query.category) {
        if (mongoose.Types.ObjectId.isValid(query.category)) filter.category = query.category;
    }
    if (query.status) filter.status = query.status;
    return await Product.find(filter)
        .populate("category business")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();
};

const getById = async (id) => {
    return await Product.findById(id).populate("category business").exec();
};

const update = async (id, data) => {
    return await Product.findByIdAndUpdate(id, data, { new: true }).exec();
};

const remove = async (id) => {
    return await Product.findByIdAndDelete(id).exec();
};

const getByBusiness = async (businessId, query = {}) => {
    if (!mongoose.Types.ObjectId.isValid(businessId)) return [];
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 50, 200);
    return await Product.find({ business: businessId })
        .populate("category business")
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
    remove,
    getByBusiness,
};