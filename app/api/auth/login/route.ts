import { NextResponse } from "next/server";
import db, { initDB } from "@/lib/database";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await initDB();

    const { username, password } = await req.json();

    const result = await db.execute({
      sql: "SELECT * FROM users WHERE username = ?",
      args: [username],
    });

    const user = result.rows[0] as unknown as {
      id: number;
      username: string;
      password: string;
      role: string;
    } | undefined;

    if (!user) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password as string);

    if (!valid) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const res = NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, role: user.role },
    });

    res.cookies.set("session", JSON.stringify({ id: user.id, role: user.role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return res;
  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}