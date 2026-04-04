// app/api/incidents/[id]/route.ts
import { NextResponse } from "next/server";
import db from "@/lib/database";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json();
    const incidentId = parseInt(params.id);

    if (!["granted", "denied", "pending"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    const stmt = db.prepare("UPDATE incidents SET status = ? WHERE id = ?");
    stmt.run(status, incidentId);

    return NextResponse.json({ success: true, status });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to update status" }, { status: 500 });
  }
}