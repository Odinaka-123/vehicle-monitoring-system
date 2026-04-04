import { NextResponse } from "next/server";
import db from "@/lib/database";

// 1. Define the Vehicle structure
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
  const { plate_number } = await req.json();

  if (!plate_number) {
    return NextResponse.json(
      { status: "denied", message: "Plate number required" },
      { status: 400 }
    );
  }

  const plate_clean = plate_number.trim().toUpperCase();

  // 2. Cast the result to Vehicle or undefined
  const vehicle = db
    .prepare("SELECT * FROM vehicles WHERE UPPER(plate_number) = ?")
    .get(plate_clean) as Vehicle | undefined;

  let status: "granted" | "denied" = "denied";
  let message = "";

  if (!vehicle) {
    message = "Vehicle not registered";
  } else {
    // 3. TypeScript now knows exactly what vehicle.status can be
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

  // ✅ Always log incident
  db.prepare(
    "INSERT INTO incidents (plate_number, status, timestamp) VALUES (?, ?, ?)"
  ).run(plate_clean, status, new Date().toISOString());

  return NextResponse.json({
    status,
    vehicle: vehicle || null,
    message,
  });
}
