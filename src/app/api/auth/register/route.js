import {
  createUser,
  findUserByEmail,
  generateJWT,
  hashPassword,
} from "@/app/lib/user";

export async function POST(req) {
  const { name, email, password } = await req.json();

  // Check if required fields are provided
  if (!name || !email || !password) {
    return new Response(
      JSON.stringify({ message: "Name, Email, and Password are required" }),
      { status: 400 }
    );
  }

  try {
    // Check if the user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the new user
    const newUser = await createUser(name, email, hashedPassword);

    // Generate a JWT token after registration
    const token = generateJWT(newUser);

    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        token,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
