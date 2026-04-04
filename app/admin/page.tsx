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

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { boxWidth: 12, font: { size: 11 } },
    },
  },
  scales: {
    x: { ticks: { font: { size: 10 }, maxRotation: 0 } },
    y: { ticks: { font: { size: 10 } } },
  },
};

export default function AdminPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [inc, veh, stat] = await Promise.all([
          fetch("/api/incidents").then((r) => r.json()),
          fetch("/api/vehicles").then((r) => r.json()),
          fetch(`/api/incidents/stats?range=${timeRange}`).then((r) => r.json()),
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

  const totalRegistered = incidents.length;
  const totalGranted = incidents.filter((i) => i.status === "granted").length;
  const totalDenied = incidents.filter((i) => i.status === "denied").length;

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

  const confirmDelete = async () => {
    if (!vehicleToDelete) return;
    try {
      await fetch(`/api/vehicles/${vehicleToDelete.id}`, { method: "DELETE" });
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleToDelete.id));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsModalOpen(false);
      setVehicleToDelete(null);
    }
  };

  const changeStatus = async (plate_number: string, status: string) => {
    try {
      await fetch("/api/vehicles/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plate_number, status }),
      });
      setVehicles((prev) =>
        prev.map((v) => (v.plate_number === plate_number ? { ...v, status } : v)),
      );
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const handleReset = async () => {
    try {
      setIsResetting(true);
      await fetch("/api/admin/reset", { method: "DELETE" });
      setIncidents([]);
      setVehicles([]);
      setIsResetModalOpen(false);
    } catch (err) {
      console.error("Reset failed:", err);
    } finally {
      setIsResetting(false);
    }
  };

  const statusColor = (status: string) => {
    if (status === "active") return "text-green-600 bg-green-50 border-green-200";
    if (status === "blacklisted") return "text-red-600 bg-red-50 border-red-200";
    return "text-slate-500 bg-slate-50 border-slate-200";
  };

  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-8 text-slate-800 overflow-x-hidden">

        {/* Header */}
        <header className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Admin Overview</h1>
          <p className="text-sm text-slate-500">System metrics and registry management.</p>
        </header>

        {/* Reset button */}
        <div className="mb-5">
          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="text-xs font-bold uppercase px-4 py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition active:scale-95"
          >
            Reset System
          </button>
        </div>

        {/* ── Stat cards: 1 column on mobile, 3 on sm+ ── */}
        <div className="flex flex-col gap-3 sm:grid sm:grid-cols-3 sm:gap-4 mb-6">
          <StatCard label="Total Logs" value={totalRegistered} />
          <StatCard label="Approved" value={totalGranted} green />
          <StatCard label="Denied" value={totalDenied} red />
        </div>

        {/* ── Chart ── */}
        <div className="w-full bg-white border p-4 sm:p-6 rounded-2xl shadow-sm mb-6 overflow-hidden">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-xs font-bold uppercase text-slate-500">Approval Trends</h2>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              aria-label="time range"
              className="text-xs border rounded px-3 py-1.5 w-full sm:w-auto"
            >
              <option value="daily">Today</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="yearly">This Year</option>
            </select>
          </div>
          <div className="relative w-full h-48 sm:h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* ── Registry ── */}
        <div className="w-full bg-white border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-slate-50">
            <h2 className="text-xs font-bold uppercase text-slate-500">Registry Management</h2>
          </div>

          {/* MOBILE: stacked cards, one per vehicle */}
          <div className="flex flex-col gap-3 p-4 md:hidden">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="border rounded-xl p-4 bg-white shadow-sm flex flex-col gap-3"
              >
                {/* Top row: plate + remove */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    {v.plate_number}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setVehicleToDelete(v); setIsModalOpen(true); }}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-700"
                  >
                    Remove
                  </button>
                </div>

                {/* Owner name */}
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Owner</p>
                  <p className="text-sm font-medium text-slate-700">{v.owner_name}</p>
                </div>

                {/* Vehicle info */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Type</p>
                    <p className="text-sm text-slate-600 capitalize">{v.vehicle_type}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Color</p>
                    <p className="text-sm text-slate-600 capitalize">{v.vehicle_color}</p>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Phone</p>
                  <p className="text-sm text-slate-600">{v.phone}</p>
                </div>

                {/* Status selector */}
                <div className="flex items-center justify-between pt-1 border-t">
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">Status</p>
                  <select
                    aria-label="status"
                    value={v.status}
                    onChange={(e) => changeStatus(v.plate_number, e.target.value)}
                    className={`text-xs font-medium rounded-full px-3 py-1 border ${statusColor(v.status)}`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="blacklisted">Blacklisted</option>
                  </select>
                </div>
              </div>
            ))}

            {vehicles.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-6">No vehicles registered.</p>
            )}
          </div>

          {/* DESKTOP: table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-4 text-xs font-semibold text-slate-500">Plate</th>
                  <th className="p-4 text-xs font-semibold text-slate-500">Owner</th>
                  <th className="p-4 text-xs font-semibold text-slate-500">Type</th>
                  <th className="p-4 text-xs font-semibold text-slate-500">Status</th>
                  <th className="p-4 text-xs font-semibold text-slate-500"></th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id} className="border-b hover:bg-slate-50 transition">
                    <td className="p-4 font-mono text-xs font-semibold">{v.plate_number}</td>
                    <td className="p-4 text-xs">{v.owner_name}</td>
                    <td className="p-4 text-xs capitalize">{v.vehicle_type}</td>
                    <td className="p-4">
                      <select
                        aria-label="status"
                        value={v.status}
                        onChange={(e) => changeStatus(v.plate_number, e.target.value)}
                        className="text-xs bg-slate-100 rounded px-2 py-1"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="blacklisted">Blacklisted</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => { setVehicleToDelete(v); setIsModalOpen(true); }}
                        className="text-xs text-rose-500 hover:text-rose-700"
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

        {/* Delete Modal */}
        {isModalOpen && (
          <Modal>
            <h3 className="text-base font-bold mb-1">Delete Vehicle</h3>
            <p className="text-sm text-slate-500 mb-4">
              Remove <span className="font-mono font-semibold text-slate-700">{vehicleToDelete?.plate_number}</span> from the registry?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 text-sm px-3 py-2 rounded-lg border hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 text-sm px-3 py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition"
              >
                Delete
              </button>
            </div>
          </Modal>
        )}

        {/* Reset Modal */}
        {isResetModalOpen && (
          <Modal>
            <h3 className="text-base font-bold mb-1 text-rose-600">Reset System</h3>
            <p className="text-sm text-slate-500 mb-4">
              This permanently deletes all vehicles and logs. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                disabled={isResetting}
                onClick={() => setIsResetModalOpen(false)}
                className="flex-1 text-sm px-3 py-2 rounded-lg border disabled:opacity-50 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                disabled={isResetting}
                onClick={handleReset}
                className="flex-1 text-sm bg-rose-500 text-white px-3 py-2 rounded-lg disabled:opacity-50 hover:bg-rose-600 transition"
              >
                {isResetting ? "Resetting..." : "Confirm Reset"}
              </button>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
}

function StatCard({
  label,
  value,
  green,
  red,
}: {
  label: string;
  value: number;
  green?: boolean;
  red?: boolean;
}) {
  return (
    <div className="bg-white border p-4 sm:p-5 rounded-2xl w-full">
      <p className="text-xs text-slate-400">{label}</p>
      <p
        className={`text-2xl font-bold mt-1 ${
          green ? "text-green-600" : red ? "text-red-600" : "text-slate-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
        {children}
      </div>
    </div>
  );
}