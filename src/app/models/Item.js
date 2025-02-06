import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required:true
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create the model from the schema
const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);

export default Item;
