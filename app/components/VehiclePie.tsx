"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// 1. Define the shape of the API response
interface VehicleStatRow {
  status: string;
  count: number;
}

type PieData = {
  name: string;
  value: number;
};

const COLORS = ["#22c55e", "#eab308", "#ef4444"]; 

export default function VehiclePie() {
  const [data, setData] = useState<PieData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/vehicles/stats");
      // 2. Cast the JSON response to your interface array
      const json = (await res.json()) as VehicleStatRow[];

      // 3. Types are now inferred correctly here
      const formatted = json.map((item) => ({
        name: item.status,
        value: item.count,
      }));

      setData(formatted);
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
        Vehicle Status Distribution
      </h2>

      <div className="h-62.5 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={60} 
              paddingAngle={5}
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
