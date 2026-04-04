"use client";
import React, { useEffect, useState, useMemo } from "react";
import Layout from "@/app/components/Layout";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
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
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [incRes, vehRes] = await Promise.all([
        fetch("/api/incidents"),
        fetch("/api/vehicles"),
      ]);
      const incData = await incRes.json();
      const vehData = await vehRes.json();
      setIncidents(incData);
      setVehicles(vehData);
    };
    loadData();
  }, []);

  const totalRegistered = incidents.length;
  const totalGranted = incidents.filter((i) => i.status === "granted").length;
  const totalDenied = incidents.filter((i) => i.status === "denied").length;

  const chartData = useMemo(() => {
    const grouped: Record<string, number> = {};
    let labels: string[] = [];

    if (timeRange === "daily") labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    if (timeRange === "weekly") labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    if (timeRange === "monthly") {
      const days = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      labels = Array.from({ length: days }, (_, i) => `${i + 1}`);
    }
    if (timeRange === "yearly") labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    labels.forEach((l) => (grouped[l] = 0));

    incidents.forEach((i) => {
      if (i.status !== "granted") return;
      const d = new Date(i.timestamp);
      let key = "";
      switch (timeRange) {
        case "daily": key = `${d.getHours()}:00`; break;
        case "weekly": key = d.toLocaleDateString("en-US", { weekday: "short" }); break;
        case "monthly": key = d.getDate().toString(); break;
        case "yearly": key = d.toLocaleDateString("en-US", { month: "short" }); break;
      }
      if (grouped[key] !== undefined) grouped[key]++;
    });

    return {
      labels,
      datasets: [
        {
          label: "Vehicles Approved",
          data: labels.map((l) => grouped[l]),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.05)",
          fill: true,
          tension: 0.4,
          pointRadius: 2,
        },
      ],
    };
  }, [incidents, timeRange]);

  const confirmDelete = async () => {
    if (!vehicleToDelete) return;
    await fetch(`/api/vehicles/${vehicleToDelete.id}`, { method: "DELETE" });
    setVehicles((prev) => prev.filter((v) => v.id !== vehicleToDelete.id));
    setIsModalOpen(false);
    setVehicleToDelete(null);
  };

  const changeStatus = async (plate_number: string, status: string) => {
    await fetch("/api/vehicles/status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plate_number, status }),
    });
    setVehicles((prev) => prev.map((v) => (v.plate_number === plate_number ? { ...v, status } : v)));
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 text-slate-800">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Overview</h1>
          <p className="text-sm text-slate-500">System metrics and registry management.</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Logs</p>
            <p className="text-3xl font-bold">{totalRegistered}</p>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Approved</p>
            <p className="text-3xl font-bold text-emerald-600">{totalGranted}</p>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1">Denied</p>
            <p className="text-3xl font-bold text-rose-600">{totalDenied}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Approval Trends</h2>
            <select
              value={timeRange}
              title="Select time range"
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none font-medium text-slate-600 cursor-pointer hover:bg-slate-100 transition"
            >
              <option value="daily">Today</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="yearly">This Year</option>
            </select>
          </div>
          <div className="h-64">
            <Line
              data={chartData}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { grid: { display: false }, ticks: { font: { size: 10 } } }, y: { ticks: { font: { size: 10 } } } }
              }}
            />
          </div>
        </div>

        {/* Vehicle Management */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/30">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Registry Management</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plate</th>
                  <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Owner</th>
                  <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status Control</th>
                  <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 font-mono text-xs font-bold text-slate-700">{v.plate_number}</td>
                    <td className="p-4 text-xs font-medium text-slate-600">{v.owner_name}</td>
                    <td className="p-4">
                      <select
                        value={v.status}
                        title="Change vehicle status"
                        onChange={(e) => changeStatus(v.plate_number, e.target.value)}
                        className="text-[10px] font-bold uppercase bg-slate-100 border-none rounded px-2 py-1 outline-none text-slate-600 focus:ring-1 focus:ring-blue-400 cursor-pointer transition"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="blacklisted">Blacklisted</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => { setVehicleToDelete(v); setIsModalOpen(true); }}
                        className="text-[10px] font-bold text-rose-400 hover:text-rose-600 uppercase tracking-tighter transition-all active:scale-95"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm Removal</h3>
              <p className="text-sm text-slate-500 mb-6">
                Are you sure you want to delete vehicle <span className="font-bold text-slate-700">{vehicleToDelete?.plate_number}</span>? This action is permanent.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-lg shadow-sm transition active:scale-95"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
