import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextApiResponse) {
  // from the url, get the name of the user and return the user object from data.json
  const fs = require("fs");
  const path = require("path");
  const filePath = path.resolve("./src/app/api/register/data.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  //get top 10 users from data.json and return them
  const topUsers = data
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 10);
  return Response.json(topUsers);
}
