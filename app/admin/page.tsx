"use client";
import React, { useEffect, useState, useMemo, ChangeEvent } from "react";
import Layout from "@/app/components/Layout";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
};

type TimeRange = "daily" | "weekly" | "monthly" | "yearly";

export default function AdminPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");

  useEffect(() => {
    const fetchIncidents = async () => {
      const res = await fetch("/api/incidents");
      const data: Incident[] = await res.json();
      setIncidents(data);
    };
    fetchIncidents();
  }, []);

  const totalRegistered = incidents.length;
  const totalGranted = incidents.filter((i) => i.status === "granted").length;
  const totalDenied = incidents.filter((i) => i.status === "denied").length;

  const recentIncidents = useMemo(() => {
    return incidents
      .slice()
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }, [incidents]);

  const chartData = useMemo(() => {
    const labels: string[] = [];
    const data: number[] = [];
    const grouped: Record<string, number> = {};

    incidents.forEach((i) => {
      if (i.status !== "granted") return;
      const d = new Date(i.timestamp);

      let key = "";
      switch (timeRange) {
        case "daily":
          key = d.getHours() + ":00";
          break;
        case "weekly":
          key = d.toLocaleDateString("en-US", { weekday: "short" });
          break;
        case "monthly":
          key = d.getDate().toString();
          break;
        case "yearly":
          key = (d.getMonth() + 1).toString();
          break;
      }
      grouped[key] = (grouped[key] || 0) + 1;
    });

    for (const k of Object.keys(grouped).sort()) {
      labels.push(k);
      data.push(grouped[k]);
    }

    return {
      labels,
      datasets: [
        {
          label: "Vehicles Approved",
          data,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          tension: 0.3,
        },
      ],
    };
  }, [incidents, timeRange]);

  const handleTimeRangeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value as TimeRange);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 max-w-5xl mx-auto">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow">
          <p className="text-gray-700 font-medium">Total Vehicles</p>
          <p className="text-2xl font-bold text-gray-900">{totalRegistered}</p>
        </div>
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow">
          <p className="text-gray-700 font-medium">Approved</p>
          <p className="text-2xl font-bold text-green-800">{totalGranted}</p>
        </div>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow">
          <p className="text-gray-700 font-medium">Denied</p>
          <p className="text-2xl font-bold text-red-800">{totalDenied}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow max-w-5xl mx-auto mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Vehicles Approved Over Time</h2>
          <select
            value={timeRange}
            onChange={handleTimeRangeChange}
            title="Select time range for chart"
            aria-label="Select time range for chart"
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <Line data={chartData} />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow max-w-5xl mx-auto overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Incidents</h2>
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {["Plate Number", "Owner Name", "Vehicle Type", "Status", "Timestamp"].map((h) => (
                <th key={h} className="p-3 text-left text-gray-700 font-medium uppercase text-xs tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentIncidents.map((i) => (
              <tr key={i.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3">{i.plate_number}</td>
                <td className="p-3">{i.vehicle?.owner_name || "Unknown"}</td>
                <td className="p-3">{i.vehicle?.vehicle_type || "-"}</td>
                <td className={`p-3 font-semibold ${i.status === "granted" ? "text-green-600" : "text-red-600"}`}>
                  {i.status.toUpperCase()}
                </td>
                <td className="p-3 text-gray-500 text-sm">{new Date(i.timestamp).toLocaleString()}</td>
              </tr>
            ))}
            {recentIncidents.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">No recent incidents</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
