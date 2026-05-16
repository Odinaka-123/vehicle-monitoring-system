import { NextResponse } from "next/server";
import db from "@/lib/database";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Registering vehicle:", body);

    const {
      owner_name,
      plate_number,
      department,
      phone,
      vehicle_type,
      vehicle_color,
      status,
    } = body;

    // Normalize plate number
    const plate_clean = plate_number.trim().toUpperCase();

    // Check for duplicate plate before inserting
    const existing = db
      .prepare("SELECT id FROM vehicles WHERE plate_number = ?")
      .get(plate_clean);

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: `Plate number "${plate_clean}" is already registered.`,
        },
        { status: 409 },
      );
    }

    const stmt = db.prepare(`
      INSERT INTO vehicles 
        (owner_name, plate_number, department, phone, vehicle_type, vehicle_color, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      owner_name,
      plate_clean,
      department,
      phone,
      vehicle_type,
      vehicle_color,
      status,
    );

    return NextResponse.json({ success: true, id: info.lastInsertRowid });
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      (err as NodeJS.ErrnoException).code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "A vehicle with this plate number already exists.",
        },
        { status: 409 },
      );
    }

    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to register vehicle" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const vehicles = db.prepare("SELECT * FROM vehicles").all();
    return NextResponse.json(vehicles);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch vehicles" },
      { status: 500 },
    );
  }
}
