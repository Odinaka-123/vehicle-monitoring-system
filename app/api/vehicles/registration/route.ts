import { NextResponse } from "next/server";
import db, { initDB } from "@/lib/database";

export async function PUT(req: Request) {
  try {
    await initDB();

    const { plate_number, registrationStatus } = await req.json();

    if (!plate_number || !["granted", "denied"].includes(registrationStatus)) {
      return NextResponse.json(
        { success: false, error: "Invalid plate_number or registrationStatus" },
        { status: 400 }
      );
    }

    const plate_clean = plate_number.trim().toUpperCase();

    const vehicle = await db.execute({
      sql: "SELECT * FROM vehicles WHERE UPPER(plate_number) = ?",
      args: [plate_clean],
    });

    if (vehicle.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Vehicle not found" },
        { status: 404 }
      );
    }

    await db.execute({
      sql: "UPDATE vehicles SET registration_status = ? WHERE UPPER(plate_number) = ?",
      args: [registrationStatus, plate_clean],
    });

    await db.execute({
      sql: "INSERT INTO incidents (plate_number, status, timestamp) VALUES (?, ?, ?)",
      args: [plate_clean, registrationStatus, new Date().toISOString()],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to update registration status" },
      { status: 500 }
    );
  }
}