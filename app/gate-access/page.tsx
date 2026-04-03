"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/app/components/Layout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CheckCircle, XCircle, Car } from "lucide-react";
import TimeRangeDropdown from "../components/TimeRangeDropdown";

type Vehicle = {
  id: number;
  owner_name: string;
  plate_number: string;
  department?: string;
  phone: string;
  vehicle_type: string;
  vehicle_color: string;
  status: string;
};

type Incident = {
  id: number;
  plate_number: string;
  status: "granted" | "denied";
  timestamp: string;
  vehicle?: Vehicle;
  message?: string;
};

type ChartData = {
  date: string;
  count: number;
};

export default function GateAccess() {
  const [plate, setPlate] = useState("");
  const [result, setResult] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<Incident[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [timeRange, setTimeRange] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("daily");

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/check-vehicle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plate_number: plate }),
      });
      const data: Incident = await res.json();
      setResult(data);
      setPlate("");
    } catch (err) {
      console.error("Gate check failed:", err);
      setResult({
        id: 0,
        plate_number: plate || "N/A",
        timestamp: new Date().toISOString(),
        status: "denied",
        message: "Server error. Try again.",
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    const fetchRecentAndChart = async () => {
      const resRecent = await fetch("/api/incidents?limit=5");
      const dataRecent: Incident[] = await resRecent.json();
      setRecent(dataRecent);

      const resChart = await fetch(`/api/incidents/stats?range=${timeRange}`);
      const dataChart: ChartData[] = await resChart.json();
      setChartData(dataChart);
    };

    fetchRecentAndChart();
  }, [result, timeRange]);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6 text-[#1E1F20]">Gate Access</h1>

      <div className="bg-white p-6 rounded-2xl shadow max-w-lg mx-auto">
        <form onSubmit={handleCheck} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Plate Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter plate number"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-4 py-3 rounded-lg flex justify-center items-center gap-2"
          >
            {loading ? "Checking..." : "Check Access"}
          </button>
        </form>

        {result && (
          <div
            className={`mt-6 p-4 rounded-lg text-center text-white font-semibold shadow transform transition-all duration-300 ${
              result.status === "granted" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {result.status === "granted" && result.vehicle ?
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className="w-10 h-10" />
                <p className="text-xl font-semibold">Access Granted!</p>
                <div className="flex items-center gap-2 bg-white rounded-lg p-2 text-gray-900 w-full justify-center shadow">
                  <Car className="w-5 h-5" />
                  <span>
                    {result.vehicle.owner_name} — {result.vehicle.plate_number}
                  </span>
                </div>
              </div>
            : <div className="flex flex-col items-center gap-2">
                <XCircle className="w-10 h-10" />
                <p className="text-xl font-semibold">
                  {result.message || "Access Denied"}
                </p>
              </div>
            }
          </div>
        )}
      </div>

      <div className="mt-6 bg-white p-6 rounded-2xl shadow max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-3 text-[#1E1F20]">
          Recent Vehicle Checks
        </h2>
        <ul className="space-y-2">
          {recent.map((i) => (
            <li
              key={i.id}
              className={`p-3 rounded-lg font-semibold flex justify-between items-center shadow-sm ${
                i.status === "granted" ?
                  "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
              }`}
            >
              <span>{i.plate_number}</span>
              <span className="text-sm">
                {new Date(i.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 bg-white p-6 rounded-2xl shadow max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#1E1F20]">
            Vehicle Approvals
          </h2>

          <div className="relative w-40">
            <TimeRangeDropdown value={timeRange} onChange={(v) => setTimeRange(v as "daily" | "weekly" | "monthly" | "yearly")} />

            
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
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
    </Layout>
  );
}
