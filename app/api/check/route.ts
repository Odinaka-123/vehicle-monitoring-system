import { NextResponse } from "next/server";
import db, { initDB } from "@/lib/database";

interface Vehicle {
  id: number;
  plate_number: string;
  owner_name: string;
  vehicle_type: string;
  vehicle_color: string;
  department: string;
  phone: string;
  status: "active" | "inactive" | "blacklisted";
}

export async function POST(req: Request) {
  try {
    await initDB();

    const { plate_number } = await req.json();

    if (!plate_number) {
      return NextResponse.json(
        { status: "denied", message: "Plate number required" },
        { status: 400 }
      );
    }

    const plate_clean = plate_number.trim().toUpperCase();

    const result = await db.execute({
      sql: "SELECT * FROM vehicles WHERE UPPER(plate_number) = ?",
      args: [plate_clean],
    });

    const vehicle = result.rows[0] as unknown as Vehicle | undefined;

    let status: "granted" | "denied" = "denied";
    let message = "";

    if (!vehicle) {
      message = "Vehicle not registered";
    } else {
      switch (vehicle.status) {
        case "active":
          status = "granted";
          break;
        case "inactive":
          status = "denied";
          message = "Vehicle inactive";
          break;
        case "blacklisted":
          status = "denied";
          message = "🚫 Vehicle blacklisted";
          break;
        default:
          message = "Access denied";
      }
    }

    await db.execute({
      sql: "INSERT INTO incidents (plate_number, status, timestamp) VALUES (?, ?, ?)",
      args: [plate_clean, status, new Date().toISOString()],
    });

    return NextResponse.json({
      status,
      vehicle: vehicle || null,
      message,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}