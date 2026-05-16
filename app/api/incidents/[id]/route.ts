import { NextResponse } from "next/server";
import db, { initDB } from "@/lib/database";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDB();

    const { status } = await req.json();
    const { id } = await params;
    const incidentId = parseInt(id);

    if (!["granted", "denied", "pending"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    await db.execute({
      sql: "UPDATE incidents SET status = ? WHERE id = ?",
      args: [status, incidentId],
    });

    return NextResponse.json({ success: true, status });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to update status" },
      { status: 500 }
    );
  }
}