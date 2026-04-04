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
import AdminRouteGuard from "@/app/components/AdminRouteGuard";

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

type User = {
  id: number;
  username: string;
  role: string;
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

  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("guard");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [inc, veh, stat, usr] = await Promise.all([
          fetch("/api/incidents").then((r) => r.json()),
          fetch("/api/vehicles").then((r) => r.json()),
          fetch(`/api/incidents/stats?range=${timeRange}`).then((r) =>
            r.json(),
          ),
          fetch("/api/users").then((r) => r.json()),
        ]);

        setIncidents(inc);
        setVehicles(veh);
        setStats(stat);
        setUsers(usr);
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
        prev.map((v) =>
          v.plate_number === plate_number ? { ...v, status } : v,
        ),
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

  const createUser = async () => {
    const res = await fetch("/api/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: newUsername,
        password: newPassword,
        role: newRole,
      }),
    });

    if (res.ok) {
      setNewUsername("");
      setNewPassword("");

      const updated = await fetch("/api/users");
      setUsers(await updated.json());
    }
  };

  const deleteUser = async (id: number) => {
    await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <AdminRouteGuard>
    <Layout>
      {/* overflow-x-hidden prevents any child from causing horizontal scroll */}
      <div className="w-full max-w-6xl mx-auto px-4 py-6 sm:py-8 text-slate-800 overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6 sm:mb-8">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
              Admin Overview
            </h1>
            <p className="text-sm text-slate-500">
              System metrics and registry management.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="self-start shrink-0 text-xs font-bold uppercase px-4 py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition active:scale-95"
          >
            Reset System
          </button>
        </header>

        {/* Stat cards — 3 equal columns, no overflow */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
          <StatCard label="Total Logs" value={totalRegistered} />
          <StatCard label="Approved" value={totalGranted} green />
          <StatCard label="Denied" value={totalDenied} red />
        </div>

        {/* Chart — constrained width, chart options enforce responsiveness */}
        <div className="w-full bg-white border p-4 sm:p-6 rounded-2xl shadow-sm mb-6 sm:mb-8 overflow-hidden">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
            <h2 className="text-xs font-bold uppercase text-slate-500">
              Approval Trends
            </h2>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              aria-label="time range"
              className="text-xs border rounded px-3 py-1.5 self-start sm:self-auto"
            >
              <option value="daily">Today</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="yearly">This Year</option>
            </select>
          </div>
          {/* Wrapper with explicit width stops Chart.js from expanding beyond container */}
          <div className="relative w-full h-52 sm:h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Registry */}
        <div className="w-full bg-white border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-slate-50">
            <h2 className="text-xs font-bold uppercase text-slate-500">
              Registry Management
            </h2>
          </div>

          {/* Mobile card list */}
          <ul className="divide-y md:hidden">
            {vehicles.map((v) => (
              <li key={v.id} className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <span className="font-mono text-xs font-semibold text-slate-700 truncate">
                    {v.plate_number}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setVehicleToDelete(v);
                      setIsModalOpen(true);
                    }}
                    className="text-xs text-rose-500 font-medium shrink-0"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-sm text-slate-600 truncate">
                  {v.owner_name}
                </p>
                <select
                  aria-label="status"
                  value={v.status}
                  onChange={(e) => changeStatus(v.plate_number, e.target.value)}
                  className="text-xs bg-slate-100 rounded px-2 py-1.5 self-start max-w-full"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="blacklisted">Blacklisted</option>
                </select>
              </li>
            ))}
          </ul>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id} className="border-b">
                    <td className="p-4 font-mono text-xs">{v.plate_number}</td>
                    <td className="p-4 text-xs">{v.owner_name}</td>
                    <td className="p-4">
                      <select
                        aria-label="status"
                        value={v.status}
                        onChange={(e) =>
                          changeStatus(v.plate_number, e.target.value)
                        }
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
                        onClick={() => {
                          setVehicleToDelete(v);
                          setIsModalOpen(true);
                        }}
                        className="text-xs text-rose-500"
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

        {/* User Management */}
<div className="mt-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
  <div className="p-4 border-b border-slate-100 bg-slate-50/30">
    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
      User Management
    </h2>
  </div>

  {/* CREATE USER */}
  <div className="p-4 flex flex-col sm:flex-row gap-2 border-b">
    <input
      placeholder="Username"
      value={newUsername}
      onChange={(e) => setNewUsername(e.target.value)}
      className="border p-2 rounded text-xs"
    />
    <input
      placeholder="Password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      className="border p-2 rounded text-xs"
      type="password"
    />
    <select
    aria-label="user role"
      value={newRole}
      onChange={(e) => setNewRole(e.target.value)}
      className="border p-2 rounded text-xs"
    >
      <option value="guard">Guard</option>
      <option value="admin">Admin</option>
    </select>

    <button
      onClick={createUser}
      className="bg-blue-500 text-white px-3 py-2 rounded text-xs"
    >
      Add User
    </button>
  </div>

  {/* USERS LIST */}
  <div className="overflow-x-auto">
    <table className="w-full text-left text-xs">
      <thead>
        <tr className="border-b">
          <th className="p-3">Username</th>
          <th className="p-3">Role</th>
          <th className="p-3 text-right">Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id} className="border-b">
            <td className="p-3">{u.username}</td>
            <td className="p-3">{u.role}</td>
            <td className="p-3 text-right">
              <button
                onClick={() => deleteUser(u.id)}
                className="text-red-500 text-xs"
              >
                Delete
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
            <h3 className="text-lg font-bold mb-2">Delete Vehicle</h3>
            <p className="text-sm mb-4">
              Delete {vehicleToDelete?.plate_number}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 text-sm px-3 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 text-sm px-3 py-2 rounded bg-rose-500 text-white"
              >
                Delete
              </button>
            </div>
          </Modal>
        )}

        {/* Reset Modal */}
        {isResetModalOpen && (
          <Modal>
            <h3 className="text-lg font-bold mb-2 text-rose-600">
              Reset System
            </h3>
            <p className="text-sm mb-4">This deletes EVERYTHING. No undo.</p>
            <div className="flex gap-3">
              <button
                disabled={isResetting}
                onClick={() => setIsResetModalOpen(false)}
                className="flex-1 text-sm px-3 py-2 rounded border disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={isResetting}
                onClick={handleReset}
                className="flex-1 text-sm bg-rose-500 text-white px-3 py-2 rounded disabled:opacity-50"
              >
                {isResetting ? "Resetting..." : "Confirm"}
              </button>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
    </AdminRouteGuard>
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
    <div className="bg-white border p-3 sm:p-5 rounded-2xl min-w-0 overflow-hidden">
      <p className="text-[10px] sm:text-xs text-slate-400 leading-tight truncate">
        {label}
      </p>
      <p
        className={`text-xl sm:text-2xl font-bold mt-1 ${
          green ? "text-green-600"
          : red ? "text-red-600"
          : ""
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
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
        {children}
      </div>
    </div>
  );
}
