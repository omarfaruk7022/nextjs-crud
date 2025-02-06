// app/api/protected/route.js
import jwt from "jsonwebtoken";

export async function GET(req) {
  const token = req.headers.get("Authorization")?.split(" ")[1]; // "Bearer token"

  if (!token) {
    return new Response(JSON.stringify({ message: "No token provided" }), {
      status: 401,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return new Response(
      JSON.stringify({ message: "Protected data accessed", user: decoded }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: "Invalid token" }), {
      status: 401,
    });
  }
}
