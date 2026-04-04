"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  date: string;
  count: number;
};

export default function VehicleChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [range, setRange] = useState("daily");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/incidents/stats?range=${range}`);
      const json = await res.json();
      setData(json);
    };

    fetchData();
  }, [range]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <div className="flex justify-between mb-4">
        <h2 className="font-semibold text-[#1E1F20]">Vehicle Approvals</h2>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="text-sm border rounded px-2 py-1"
          aria-label="range"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3B82F6"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}