import { NextRequest } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import Redis from "ioredis";

// Initialize Redis client using REDIS_URL from .env
const redis = new Redis(process.env.REDIS_URL as string);

export async function GET(req: NextRequest) {
  try {
    noStore();

    // Retrieve the users data from Redis
    const usersJson = await redis.get("users");
    const users = usersJson ? JSON.parse(usersJson) : [];

    // Get the top 10 users based on their score
    const topUsers = users
      ?.sort((a: any, b: any) => b.score - a.score)
      .slice(0, 10);

    return new Response(JSON.stringify(topUsers), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing GET request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
