import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { unstable_noStore as noStore } from "next/cache";

export async function GET(req: NextRequest) {
  noStore();
  const name = req.nextUrl.searchParams.get("name");
  const users: [] | null = await kv.get("users");
  const user: any = users?.find((user: any) => user.name === name);
  const score = user ? user.score : 0;
  return NextResponse.json({ name, score });
}
