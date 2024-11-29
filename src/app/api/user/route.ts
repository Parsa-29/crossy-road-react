import { NextRequest, NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import Redis from "ioredis";

// Initialize Redis client using REDIS_URL from .env
const redis = new Redis(process.env.REDIS_URL as string);

export async function GET(req: NextRequest) {
  try {
    noStore();

    // Retrieve the "name" query parameter from the request
    const name = req.nextUrl.searchParams.get("name");

    if (!name) {
      return NextResponse.json(
        { error: "Name parameter is required" },
        { status: 400 }
      );
    }

    // Get the users data from Redis
    const usersJson = await redis.get("users");
    const users = usersJson ? JSON.parse(usersJson) : [];

    // Find the user with the specified name
    const user = users.find((user: any) => user.name === name);

    // Determine the user's score or set it to 0 if not found
    const score = user ? user.score : 0;

    return NextResponse.json({ name, score });
  } catch (error) {
    console.error("Error processing GET request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
