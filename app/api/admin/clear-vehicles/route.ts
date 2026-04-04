import { NextResponse } from "next/server";
import db from "@/lib/database";

export async function DELETE() {
  try {
    db.prepare("DELETE FROM vehicles").run();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Clear vehicles error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}