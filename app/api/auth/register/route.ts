import { NextResponse } from "next/server";
import db, { initDB } from "@/lib/database";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await initDB();

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "All fields required" },
        { status: 400 }
      );
    }

    const existing = await db.execute({
      sql: "SELECT id FROM users WHERE username = ?",
      args: [username],
    });

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.execute({
      sql: "INSERT INTO users (username, password) VALUES (?, ?)",
      args: [username, hashed],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}