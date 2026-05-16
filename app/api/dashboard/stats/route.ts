import { NextResponse } from "next/server";
import db, { initDB } from "@/lib/database";

export async function GET() {
  try {
    await initDB();

    const totalVehicles = await db.execute(
      "SELECT COUNT(*) as count FROM vehicles"
    );

    const vehiclesInside = await db.execute(`
      SELECT COUNT(*) as count 
      FROM incidents 
      WHERE status = 'granted' 
      AND DATE(timestamp) = DATE('now')
    `);

    const incidentsToday = await db.execute(`
      SELECT COUNT(*) as count 
      FROM incidents 
      WHERE DATE(timestamp) = DATE('now')
    `);

    const deniedToday = await db.execute(`
      SELECT COUNT(*) as count 
      FROM incidents 
      WHERE status = 'denied'
      AND DATE(timestamp) = DATE('now')
    `);

    return NextResponse.json({
      totalVehicles: totalVehicles.rows[0].count,
      vehiclesInside: vehiclesInside.rows[0].count,
      incidentsToday: incidentsToday.rows[0].count,
      deniedToday: deniedToday.rows[0].count,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}