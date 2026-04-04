import { NextResponse } from "next/server";
import db from "@/lib/database";

export async function DELETE() {
  try {
    // Clear everything
    db.prepare("DELETE FROM incidents").run();
    db.prepare("DELETE FROM vehicles").run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}