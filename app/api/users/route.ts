import { NextResponse } from "next/server";
import db from "@/lib/database";

export async function GET() {
  const users = db
    .prepare("SELECT id, username, role FROM users")
    .all();

  return NextResponse.json(users);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  db.prepare("DELETE FROM users WHERE id = ?").run(id);

  return NextResponse.json({ success: true });
}