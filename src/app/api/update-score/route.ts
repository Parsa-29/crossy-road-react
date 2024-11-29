"use server";

import { NextRequest } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import Redis from "ioredis";

// Initialize Redis client using REDIS_URL from .env
const redis = new Redis(process.env.REDIS_URL as string);

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request data
    const { userData }: any = await req.json();
    noStore();

    // Retrieve the users data from Redis
    const usersJson = await redis.get("users");
    const users = usersJson ? JSON.parse(usersJson) : [];

    // Find the user with the specified ID
    const user = users.find((user: any) => user.id === userData.id);

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        headers: { "Content-Type": "application/json" },
        status: 404,
      });
    }

    // Update the user's score if the new score is higher
    if (userData.score > user.score) {
      user.score = userData.score;

      // Update the "users" key in Redis with the modified user list
      const updatedUsers = [
        ...users.filter((u: any) => u.id !== userData.id),
        user,
      ];
      await redis.set("users", JSON.stringify(updatedUsers));
    }

    return new Response(JSON.stringify(user), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing POST request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
