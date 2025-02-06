import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Ensure users provide their name
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure the email is unique
    },
    password: {
      type: String,
      required: true, // Ensure the password is provided
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Use the existing model or create a new one
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
