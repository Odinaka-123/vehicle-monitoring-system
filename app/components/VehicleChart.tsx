"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", vehicles: 30 },
  { day: "Tue", vehicles: 45 },
  { day: "Wed", vehicles: 28 },
  { day: "Thu", vehicles: 50 },
  { day: "Fri", vehicles: 40 },
  { day: "Sat", vehicles: 60 },
  { day: "Sun", vehicles: 35 },
];

export default function VehicleChart() {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border">
      <h2 className="text-lg font-semibold mb-4 text-[#1E1F20]">Vehicle Activity</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="vehicles" stroke="#1E1F20" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}