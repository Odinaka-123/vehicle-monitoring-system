import { NextResponse } from "next/server";
import db, { initDB } from "@/lib/database";

export async function DELETE() {
  try {
    await initDB();

    await db.execute("DELETE FROM incidents");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Clear incidents error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}