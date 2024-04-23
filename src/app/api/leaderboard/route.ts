import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { kv } from "@vercel/kv";
import { unstable_noStore as noStore } from "next/cache";

export async function GET(req: NextRequest, res: NextApiResponse) {
  noStore();
  const users: [] | null = await kv.get("users");

  //get top 10 users from data.json and return them

  const topUsers = users
    ?.sort((a: any, b: any) => b.score - a.score)
    .slice(0, 10);

  return Response.json(topUsers);
}
