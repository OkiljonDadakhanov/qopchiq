import mongoose from "mongoose";
import Category from "../models/category.model.js";
import { connectDB } from "../db/connectDB.js";

const seedCategories = async () => {
  try {
    await connectDB();
    
    const categories = [
      { name: "Meals" },
      { name: "Bakery" },
      { name: "Groceries" },
      { name: "Fresh Produce" },
      { name: "Dairy Products" },
      { name: "Meat & Seafood" },
      { name: "Beverages" },
      { name: "Snacks" },
      { name: "Plants & Flowers" },
      { name: "Cosmetics & Beauty" },
      { name: "Health & Wellness" },
      { name: "Household Items" },
      { name: "Books & Media" },
      { name: "Clothing & Accessories" },
      { name: "Electronics" },
      { name: "Other" }
    ];

    for (const categoryData of categories) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${categoryData.name}$`, 'i') } 
      });
      if (!existingCategory) {
        const category = new Category(categoryData);
        await category.save();
        console.log(`Created category: ${categoryData.name}`);
      } else {
        console.log(`Category already exists: ${categoryData.name}`);
      }
    }

    console.log("Category seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
};

seedCategories();

