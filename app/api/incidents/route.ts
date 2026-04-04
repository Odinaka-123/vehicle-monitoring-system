import { NextResponse } from "next/server";
import db from "@/lib/database";

// 1. Define the shape of the database row
interface IncidentRow {
  id: number;
  plate_number: string;
  status: string;
  timestamp: string;
  vehicle_id: number | null;
  owner_name: string | null;
  vehicle_type: string | null;
  vehicle_color: string | null;
  department: string | null;
  phone: string | null;
  vehicle_status: string | null;
}

export async function GET() {
  try {
    // 2. Cast the .all() result to your interface array
    const rows = db.prepare(`
      SELECT 
        incidents.id as id,
        incidents.plate_number,
        incidents.status,
        incidents.timestamp,
        vehicles.id as vehicle_id,
        vehicles.owner_name,
        vehicles.vehicle_type,
        vehicles.vehicle_color,
        vehicles.department,
        vehicles.phone,
        vehicles.status as vehicle_status
      FROM incidents
      LEFT JOIN vehicles 
        ON vehicles.plate_number = incidents.plate_number
      ORDER BY incidents.timestamp DESC
    `).all() as IncidentRow[];

    const data = rows.map((r) => ({
      id: r.id,
      plate_number: r.plate_number,
      status: r.status,
      timestamp: r.timestamp,
      vehicle: r.vehicle_id
        ? {
            id: r.vehicle_id,
            owner_name: r.owner_name,
            plate_number: r.plate_number,
            vehicle_type: r.vehicle_type,
            vehicle_color: r.vehicle_color,
            department: r.department,
            phone: r.phone,
            status: r.vehicle_status,
          }
        : null,
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
