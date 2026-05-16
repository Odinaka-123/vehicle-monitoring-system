import { NextResponse } from "next/server";
import { initDB } from "@/lib/database";

export async function GET() {
  try {
    await initDB();
    return NextResponse.json({ success: true, message: "Database seeded" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
