import { NextResponse } from "next/server";
import db, { initDB } from "@/lib/database";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDB();

    const { id } = await params;

    await db.execute({
      sql: "DELETE FROM vehicles WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}