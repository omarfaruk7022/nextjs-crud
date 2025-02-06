

import { comparePasswords, findUserByEmail, generateJWT } from "@/app/lib/user";

export async function POST(req) {
  const { email, password } = await req.json();

  // Check if email and password are provided
  if (!email || !password) {
    return new Response(
      JSON.stringify({ message: "Email and Password are required" }),
      { status: 400 }
    );
  }

  try {
    // Find user by email
    const user = await findUserByEmail(email);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    // Compare the provided password with the stored password
    const isMatch = await comparePasswords(password, user.password);

    if (!isMatch) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 400,
      });
    }

    // Generate a JWT token for the user
    const token = generateJWT(user);

    return new Response(
      JSON.stringify({
        message: "Login successful",
        token,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
