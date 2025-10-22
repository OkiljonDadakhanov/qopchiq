import Category from "../models/category.model.js";

const create = async (data) => {
    const category = new Category(data);
    return await category.save();
};

const getAll = async (query = {}) => {
    // pagination simple support
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 50, 200);
    return await Category.find({})
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ name: 1 })
        .exec();
};

const getById = async (id) => {
    return await Category.findById(id).exec();
};

const update = async (id, data) => {
    return await Category.findByIdAndUpdate(id, data, { new: true }).exec();
};

const remove = async (id) => {
    return await Category.findByIdAndDelete(id).exec();
};

export default {
    create,
    getAll,
    getById,
    update,
    remove,
};