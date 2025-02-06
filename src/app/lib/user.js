import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User"; // Import your User model

// Function to hash the password before saving it
export async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePasswords(enteredPassword, storedPassword) {
  return await bcrypt.compare(enteredPassword, storedPassword);
}

// Function to generate a JWT token for the authenticated user
export function generateJWT(user) {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET, // Use JWT_SECRET from environment variables
    { expiresIn: "1h" } // Token expiration time (1 hour in this case)
  );
}

// Function to find a user by email (for login or registration)
export async function findUserByEmail(email) {
  return await User.findOne({ email });
}

// Function to create a new user in the database
export async function createUser(name, email, hashedPassword) {
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();
  return newUser;
}
