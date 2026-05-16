import { NextResponse } from "next/server";
import db, { initDB } from "@/lib/database";

export async function GET() {
  try {
    await initDB();

    const result = await db.execute("SELECT id, username, role FROM users");

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await initDB();

    const { id } = await req.json();

    await db.execute({
      sql: "DELETE FROM users WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}