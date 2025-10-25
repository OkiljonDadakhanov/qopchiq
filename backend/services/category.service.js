import Category from "../models/category.model.js";
import mongoose from "mongoose";

const create = async (data) => {
    // Validate required fields
    if (!data.name || data.name.trim().length === 0) {
        throw new Error("Category name is required");
    }

    // Check for duplicate names
    const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${data.name.trim()}$`, 'i') } 
    });
    
    if (existingCategory) {
        throw new Error("Category with this name already exists");
    }

    const category = new Category({
        name: data.name.trim()
    });
    return await category.save();
};

const getAll = async (query = {}) => {
    try {
        // pagination simple support
        const page = parseInt(query.page) || 1;
        const limit = Math.min(parseInt(query.limit) || 50, 200);
        
        // Add search functionality
        const searchQuery = {};
        if (query.search) {
            searchQuery.name = { $regex: query.search, $options: 'i' };
        }

        return await Category.find(searchQuery)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ name: 1 })
            .exec();
    } catch (error) {
        throw new Error(`Failed to fetch categories: ${error.message}`);
    }
};

const getById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid category ID");
    }
    
    const category = await Category.findById(id).exec();
    if (!category) {
        throw new Error("Category not found");
    }
    
    return category;
};

const update = async (id, data) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid category ID");
    }

    // Validate required fields
    if (data.name && data.name.trim().length === 0) {
        throw new Error("Category name cannot be empty");
    }

    // Check for duplicate names (excluding current category)
    if (data.name) {
        const existingCategory = await Category.findOne({ 
            name: { $regex: new RegExp(`^${data.name.trim()}$`, 'i') },
            _id: { $ne: id }
        });
        
        if (existingCategory) {
            throw new Error("Category with this name already exists");
        }
    }

    const category = await Category.findByIdAndUpdate(
        id, 
        { ...data, name: data.name?.trim() }, 
        { new: true, runValidators: true }
    ).exec();
    
    if (!category) {
        throw new Error("Category not found");
    }
    
    return category;
};

const remove = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid category ID");
    }

    // Check if category is being used by any products
    const Product = (await import("./product.service.js")).default;
    const productsUsingCategory = await Product.find({ category: id }).limit(1);
    
    if (productsUsingCategory.length > 0) {
        throw new Error("Cannot delete category that is being used by products");
    }

    const category = await Category.findByIdAndDelete(id).exec();
    if (!category) {
        throw new Error("Category not found");
    }
    
    return category;
};

export default {
    create,
    getAll,
    getById,
    update,
    remove,
};