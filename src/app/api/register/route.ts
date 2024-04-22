import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const fs = require("fs");
    const path = require("path");
    const filePath = path.resolve("./src/app/api/register/data.json");
    
    // Read the existing data or initialize an empty array
    let data = [];
    if (fs.existsSync(filePath)) {
      data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
    
    const id = data.length + 1;
    const { name } = await req.json();
    const score = 0;
    
    data.push({ id, name, score });
    
    fs.writeFileSync(filePath, JSON.stringify(data));
    
    return Response.json({ id, name, score });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
