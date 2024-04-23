'use server'
import { NextRequest } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { kv } from "@vercel/kv";

export async function POST(req: NextRequest) {
  const { userData }: any = await req.json();
  noStore();
  const users: any = await kv.get("users");
  const user = users?.find((user: any) => user.id === userData.id);
  if (!user) {
    return Response.json({ error: "User not found" });
  }
  if (userData.score > user?.score) {
    //update only user's score and other data remains the same
    user.score = userData.score;
    await kv.set("users", [
      ...users.filter((u: any) => u.id !== userData.id),
      user,
    ]);
  }
  return Response.json(user);
}
