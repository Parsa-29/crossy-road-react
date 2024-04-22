import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  //find user by id from localstorage and update score
  const fs = require("fs");
  const path = require("path");
  const filePath = path.resolve("./src/app/api/register/data.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const { userData }: any = await req.json();
  const user = data.find((user: any) => user.id === userData.id);
  //update score only if new score is greater than old score
  // user.score = userData.score;
  if (userData.score > user.score) {
    user.score = userData.score;
    fs.writeFileSync(filePath, JSON.stringify(data));
  }
  return Response.json(user);
}
