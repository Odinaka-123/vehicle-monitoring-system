"use client";
import React, { useEffect, useState } from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

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
  vehicle?: Vehicle | null;
};

type TimeRange = "daily" | "weekly" | "monthly" | "yearly";

type Stat = {
  label: string;
  count: number;
};

export default function AdminPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");
  

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  // 🔥 LOAD DATA (NOW INCLUDES STATS)
  useEffect(() => {
    const loadData = async () => {
      try {
        const [inc, veh, stat] = await Promise.all([
          fetch("/api/incidents").then((r) => r.json()),
          fetch("/api/vehicles").then((r) => r.json()),
          fetch(`/api/incidents/stats?range=${timeRange}`).then((r) =>
            r.json(),
          ),
        ]);

        setIncidents(inc);
        setVehicles(veh);
        setStats(stat);
      } catch (err) {
        console.error("Failed to load admin data:", err);
      }
    };

    loadData();
  }, [timeRange]);

  // 🔢 METRICS
  const totalRegistered = incidents.length;
  const totalGranted = incidents.filter((i) => i.status === "granted").length;
  const totalDenied = incidents.filter((i) => i.status === "denied").length;

  // 📊 BACKEND-DRIVEN CHART
  const chartData = {
    labels: stats.map((s) => s.label),
    datasets: [
      {
        label: "Vehicles Approved",
        data: stats.map((s) => s.count),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.05)",
        fill: true,
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  // 🗑 DELETE VEHICLE
  const confirmDelete = async () => {
    if (!vehicleToDelete) return;

    await fetch(`/api/vehicles/${vehicleToDelete.id}`, {
      method: "DELETE",
    });

    setVehicles((prev) => prev.filter((v) => v.id !== vehicleToDelete.id));
    setIsModalOpen(false);
    setVehicleToDelete(null);
  };

  // 🔄 UPDATE STATUS
  const changeStatus = async (plate_number: string, status: string) => {
    await fetch("/api/vehicles/status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plate_number, status }),
    });

    setVehicles((prev) =>
      prev.map((v) => (v.plate_number === plate_number ? { ...v, status } : v)),
    );
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 text-slate-800">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Admin Overview
          </h1>
          <p className="text-sm text-slate-500">
            System metrics and registry management.
          </p>
        </header>
        <div className="flex justify-end mb-6">
          <button
            onClick={async () => {
              const confirm = window.confirm(
                "This will wipe ALL data. Continue?",
              );
              if (!confirm) return;

              await fetch("/api/admin/reset", { method: "DELETE" });

              setIncidents([]);
              setVehicles([]);
            }}
            className="text-xs font-bold uppercase px-4 py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition active:scale-95"
          >
            Reset System
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Total Logs
            </p>
            <p className="text-3xl font-bold">{totalRegistered}</p>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">
              Approved
            </p>
            <p className="text-3xl font-bold text-emerald-600">
              {totalGranted}
            </p>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1">
              Denied
            </p>
            <p className="text-3xl font-bold text-rose-600">{totalDenied}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Approval Trends
            </h2>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none font-medium text-slate-600 cursor-pointer hover:bg-slate-100 transition"
              aria-label="time range"
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
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { font: { size: 10 } },
                  },
                  y: { ticks: { font: { size: 10 } } },
                },
              }}
            />
          </div>
        </div>

        {/* Vehicle Management */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/30">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Registry Management
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Plate
                  </th>
                  <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Owner
                  </th>
                  <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Status Control
                  </th>
                  <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-mono text-xs font-bold text-slate-700">
                      {v.plate_number}
                    </td>
                    <td className="p-4 text-xs font-medium text-slate-600">
                      {v.owner_name}
                    </td>
                    <td className="p-4">
                      <select
                        value={v.status}
                        onChange={(e) =>
                          changeStatus(v.plate_number, e.target.value)
                        }
                        aria-label="status change"
                        className="text-[10px] font-bold uppercase bg-slate-100 rounded px-2 py-1 text-slate-600"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="blacklisted">Blacklisted</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setVehicleToDelete(v);
                          setIsModalOpen(true);
                        }}
                        className="text-[10px] font-bold text-rose-400 hover:text-rose-600"
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

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Animated Backdrop */}
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl shadow-slate-200/50 w-full max-w-sm overflow-hidden transform transition-all border border-slate-100">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-rose-50">
                  <svg
                    className="w-6 h-6 text-rose-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Delete Vehicle
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1 rounded">
                    {vehicleToDelete?.plate_number}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 border-t border-slate-100">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-rose-200 active:scale-[0.98]"
                >
                  Delete Vehicle
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
