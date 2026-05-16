import { NextResponse } from "next/server";
import db, { initDB } from "@/lib/database";

export async function POST(req: Request) {
  try {
    await initDB();

    const body = await req.json();
    console.log("Registering vehicle:", body);

    const { owner_name, plate_number, department, phone, vehicle_type, vehicle_color, status } = body;

    const plate_clean = plate_number.trim().toUpperCase();

    const existing = await db.execute({
      sql: "SELECT id FROM vehicles WHERE plate_number = ?",
      args: [plate_clean],
    });

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: `Plate number "${plate_clean}" is already registered.` },
        { status: 409 }
      );
    }

    const result = await db.execute({
      sql: `INSERT INTO vehicles 
              (owner_name, plate_number, department, phone, vehicle_type, vehicle_color, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [owner_name, plate_clean, department, phone, vehicle_type, vehicle_color, status],
    });

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("UNIQUE")) {
      return NextResponse.json(
        { success: false, error: "A vehicle with this plate number already exists." },
        { status: 409 }
      );
    }

    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to register vehicle" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await initDB();

    const result = await db.execute("SELECT * FROM vehicles");

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}