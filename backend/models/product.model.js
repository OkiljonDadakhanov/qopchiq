import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business", // mahsulotni kim joylaganini bilish uchun
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String], // bir nechta rasm URL
    validate: [arrayLimit, "{PATH} exceeds the limit of 10"], // max 10 ta
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // category model bilan bog'lash
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    amount: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      enum: ["kg", "g", "l", "ml", "pcs"], // birlik turi
      default: "pcs",
    },
  },
  stock: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "sold", "expired"],
    default: "available",
  },
  expiresAt: {
    type: Date, // isrofgarchilik loyihasi uchun muhim
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// helper function — rasm soni limiti
function arrayLimit(val) {
  return val.length <= 10;
}

// updatedAt auto-update qilish
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
