import { NextResponse } from "next/server";
import db from "@/lib/database";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const user = db
      .prepare("SELECT * FROM users WHERE username = ?")
      .get(username) as {
      id: number;
      username: string;
      password: string;
      role: string;
    } | undefined;

    if (!user) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    // ✅ Create response
    const res = NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, role: user.role },
    });

    // 🍪 Set session cookie
    res.cookies.set("session", JSON.stringify({
      id: user.id,
      role: user.role,
    }), {
      httpOnly: true,
      path: "/",
    });

    return res;

  } catch (err) {
  console.error("Login Error:", err); 
}
}