import { NextResponse } from "next/server";
import db from "@/lib/database";

export async function GET() {
  try {
    const rows = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM vehicles
      GROUP BY status
    `).all() as { status: string; count: number }[];

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}