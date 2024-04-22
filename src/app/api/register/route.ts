import { NextApiRequest } from "next";

export async function POST(req: NextApiRequest) {
  //write user id, name, score to data.json file
  const fs = require("fs");
  const path = require("path");
  const filePath = path.resolve("./src/app/api/register/data.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const id = data.length + 1;
  const { name } = await req.json();
  const score = 0;
  data.push({ id, name, score });
  fs.writeFileSync(filePath, JSON.stringify(data));

  return Response.json({ id, name, score });
}
