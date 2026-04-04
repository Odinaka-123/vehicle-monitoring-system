import { NextResponse } from "next/server";
import db from "@/lib/database";

export async function GET() {
  try {
    // Total vehicles
    const totalVehicles = db
      .prepare("SELECT COUNT(*) as count FROM vehicles")
      .get() as { count: number };

    // Vehicles currently "inside" (granted today)
    const vehiclesInside = db
      .prepare(`
        SELECT COUNT(*) as count 
        FROM incidents 
        WHERE status = 'granted' 
        AND DATE(timestamp) = DATE('now')
      `)
      .get() as { count: number };

    // Incidents today
    const incidentsToday = db
      .prepare(`
        SELECT COUNT(*) as count 
        FROM incidents 
        WHERE DATE(timestamp) = DATE('now')
      `)
      .get() as { count: number };

    // Denied today
    const deniedToday = db
      .prepare(`
        SELECT COUNT(*) as count 
        FROM incidents 
        WHERE status = 'denied'
        AND DATE(timestamp) = DATE('now')
      `)
      .get() as { count: number };

    return NextResponse.json({
      totalVehicles: totalVehicles.count,
      vehiclesInside: vehiclesInside.count,
      incidentsToday: incidentsToday.count,
      deniedToday: deniedToday.count,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}