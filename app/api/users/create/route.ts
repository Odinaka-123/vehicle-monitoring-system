import { NextResponse } from "next/server";
import db from "@/lib/database";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, password, role } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 },
      );
    }

    const existing = db
      .prepare("SELECT id FROM users WHERE username = ?")
      .get(username);

    if (existing) {
      return NextResponse.json(
        { success: false, message: "User exists" },
        { status: 409 },
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    db.prepare(
      `
      INSERT INTO users (username, password, role)
      VALUES (?, ?, ?)
    `,
    ).run(username, hashed, role || "guard");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Registration error:", err);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
