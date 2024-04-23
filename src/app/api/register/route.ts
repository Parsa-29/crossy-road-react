import { NextRequest } from "next/server";
import { kv } from "@vercel/kv";
import { unstable_noStore as noStore } from "next/cache";
export async function POST(req: NextRequest) {
  try {
    noStore();

    const users: [] | null = await kv.get("users");
    const data = users ? users : [];

    const id = Math.random().toString(36).substr(2, 9);
    const { name } = await req.json();
    const score = 0;

    //update "users" key in KV with new user data
    await kv.set("users", [...data, { id, name, score }]);

    return Response.json({ id, name, score });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
