import { NextRequest } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import Redis from "ioredis";

// Initialize Redis client using REDIS_URL from .env
const redis = new Redis(process.env.REDIS_URL as string);

export async function POST(req: NextRequest) {
  try {
    noStore();

    // Get the users data from Redis
    const usersJson = await redis.get("users");
    const users = usersJson ? JSON.parse(usersJson) : [];

    // Generate a new user
    const id = Math.random().toString(36).substr(2, 9);
    const { name } = await req.json();
    const score = 0;

    // Update the "users" key in Redis with new user data
    const updatedUsers = [...users, { id, name, score }];
    await redis.set("users", JSON.stringify(updatedUsers));

    return new Response(JSON.stringify({ id, name, score }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
