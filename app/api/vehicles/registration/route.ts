import { NextResponse } from "next/server";
import db from "@/lib/database";

export async function PUT(req: Request) {
  try {
    const { plate_number, registrationStatus } = await req.json();

    if (!plate_number || !["granted", "denied"].includes(registrationStatus)) {
      return NextResponse.json(
        { success: false, error: "Invalid plate_number or registrationStatus" },
        { status: 400 }
      );
    }

    const plate_clean = plate_number.trim().toUpperCase();

    // Check vehicle exists
    const vehicle = db
      .prepare("SELECT * FROM vehicles WHERE UPPER(plate_number) = ?")
      .get(plate_clean);

    if (!vehicle) {
      return NextResponse.json(
        { success: false, error: "Vehicle not found" },
        { status: 404 }
      );
    }

    // Update registration_status
    db.prepare(
      "UPDATE vehicles SET registration_status = ? WHERE UPPER(plate_number) = ?"
    ).run(registrationStatus, plate_clean);

    // Optional: log incident
    db.prepare(
      "INSERT INTO incidents (plate_number, status, timestamp) VALUES (?, ?, ?)"
    ).run(plate_clean, registrationStatus, new Date().toISOString());

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to update registration status" },
      { status: 500 }
    );
  }
}