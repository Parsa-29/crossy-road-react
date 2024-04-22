import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextApiResponse) {
  // from the url, get the name of the user and return the user object from data.json
  const fs = require("fs");
  const path = require("path");
  const filePath = path.resolve("./src/app/api/register/data.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const name = req.nextUrl.searchParams.get("name");
  const user = data.find((user: any) => user.name === name);
  const score = user ? user.score : 0;
  return Response.json({ name, score });
}
