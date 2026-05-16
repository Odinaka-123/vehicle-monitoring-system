import { NextResponse } from "next/server";
import db, { initDB } from "@/lib/database";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await initDB();

    const { username, password, role } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    const existing = await db.execute({
      sql: "SELECT id FROM users WHERE username = ?",
      args: [username],
    });

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: "User exists" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.execute({
      sql: "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      args: [username, hashed, role || "guard"],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}