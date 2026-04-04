import { NextResponse } from "next/server";
import db from "@/lib/database";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    db.prepare("DELETE FROM vehicles WHERE id = ?").run(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}