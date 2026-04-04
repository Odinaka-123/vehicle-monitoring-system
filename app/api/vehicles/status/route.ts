import { NextResponse } from "next/server";
import db from "@/lib/database";

export async function PUT(req: Request) {
  try {
    const { plate_number, status } = await req.json();

    if (!plate_number || !["active", "inactive", "blacklisted"].includes(status)) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const plate = plate_number.trim().toUpperCase();

    db.prepare(`
      UPDATE vehicles 
      SET status = ? 
      WHERE UPPER(plate_number) = ?
    `).run(status, plate);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}