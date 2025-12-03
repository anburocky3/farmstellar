import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataDir = path.join(process.cwd(), "server", "data");
const dataPath = path.join(dataDir, "farms.json");

async function ensureDataFile() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.access(dataPath);
  } catch (e) {
    // create file with empty array
    await fs.writeFile(dataPath, "[]", "utf8");
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    await ensureDataFile();
    const content = await fs.readFile(dataPath, "utf8");
    const arr = JSON.parse(content || "[]");
    const item = { id: Date.now(), createdAt: new Date().toISOString(), ...body };
    arr.push(item);
    await fs.writeFile(dataPath, JSON.stringify(arr, null, 2), "utf8");
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
