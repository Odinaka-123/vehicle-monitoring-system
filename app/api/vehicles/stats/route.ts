import { NextResponse } from "next/server";
import db, { initDB } from "@/lib/database";

export async function GET() {
  try {
    await initDB();

    const result = await db.execute(`
      SELECT status, COUNT(*) as count
      FROM vehicles
      GROUP BY status
    `);

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}