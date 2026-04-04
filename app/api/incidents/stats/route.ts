import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database";

// Define the shape of the database result
interface AnalyticsRow {
  label: string;
  count: number;
}

// Define the allowed keys for the range
type TimeRange = "daily" | "weekly" | "monthly" | "yearly";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  // Cast the query param and fallback to daily
  const range = (searchParams.get("range") || "daily") as TimeRange;

  // Use Record to map specific keys to strings
  const formats: Record<TimeRange, string> = {
    daily: "%H",
    weekly: "%w",
    monthly: "%d",
    yearly: "%m",
  };

  const format = formats[range] || formats.daily;

  try {
    const data = db.prepare(`
      SELECT 
        STRFTIME('${format}', timestamp) as label,
        COUNT(*) as count
      FROM incidents
      WHERE status='granted'
      GROUP BY label
      ORDER BY label
    `).all() as AnalyticsRow[];

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
