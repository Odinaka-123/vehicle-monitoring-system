"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Inside", value: 45 },
  { name: "Outside", value: 75 },
];

const COLORS = ["#3b82f6", "#e5e7eb"];

export default function VehiclePie() {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border">
      <h2 className="text-lg font-semibold mb-4 text-[#1E1F20]">Vehicle Status</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}