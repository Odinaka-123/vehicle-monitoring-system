import { NextRequest, NextResponse } from "next/server";
import db, { initDB } from "@/lib/database";

interface AnalyticsRow {
  label: string;
  count: number;
}

type TimeRange = "daily" | "weekly" | "monthly" | "yearly";

export async function GET(req: NextRequest) {
  try {
    await initDB();

    const { searchParams } = new URL(req.url);
    const range = (searchParams.get("range") || "daily") as TimeRange;

    const formats: Record<TimeRange, string> = {
      daily: "%H",
      weekly: "%w",
      monthly: "%d",
      yearly: "%m",
    };

    const format = formats[range] || formats.daily;

    const result = await db.execute(`
      SELECT 
        STRFTIME('${format}', timestamp) as label,
        COUNT(*) as count
      FROM incidents
      WHERE status = 'granted'
      GROUP BY label
      ORDER BY label
    `);

    return NextResponse.json(result.rows as unknown as AnalyticsRow[]);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
