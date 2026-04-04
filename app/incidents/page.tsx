"use client";
import React, { useEffect, useState, useMemo } from "react";
import Layout from "@/app/components/Layout";

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

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [search, setSearch] = useState("");

 useEffect(() => {
  const fetchIncidents = async () => {
    const res = await fetch("/api/incidents");
    const data: Incident[] = await res.json();
    setIncidents(data);
  };

  fetchIncidents();
  const interval = setInterval(fetchIncidents, 5000); // every 5 seconds

  return () => clearInterval(interval);
}, []);

  const filteredIncidents = useMemo(() => {
    const lower = search.toLowerCase();
    return !search
      ? incidents
      : incidents.filter(
          (i) =>
            i.plate_number.toLowerCase().includes(lower) ||
            i.vehicle?.owner_name.toLowerCase().includes(lower)
        );
  }, [search, incidents]);

  const recent = incidents
    .filter((i) => i.status === "granted" && i.vehicle)
    .slice(0, 4); // Show 4 for better grid symmetry

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Vehicle Activity Logs
          </h1>
          <p className="text-slate-500 text-sm">Monitor real-time access and incident history.</p>
        </header>

        {/* Recent Approved Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {recent.length > 0 ? (
            recent.map((i) => (
              <div
                key={i.id}
                className="bg-white border border-emerald-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Recent Entry
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(i.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-700 truncate">
                  {i.vehicle?.owner_name}
                </p>
                <p className="text-xs font-mono text-slate-500">{i.plate_number}</p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-slate-400 py-4 text-xs bg-slate-50 rounded-lg border border-dashed border-slate-200">
              No recent activity recorded.
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Filter by plate or owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 text-sm p-2.5 pl-4 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-slate-700 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Incidents Table Container */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="w-32 p-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Plate</th>
                  <th className="w-44 p-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Owner</th>
                  <th className="w-32 p-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Type/Color</th>
                  <th className="w-40 p-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Dept/Phone</th>
                  <th className="w-28 p-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="w-40 p-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIncidents.length > 0 ? (
                  filteredIncidents.map((i) => (
                    <tr key={i.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="p-4">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                          {i.plate_number}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-xs font-medium text-slate-700 truncate" title={i.vehicle?.owner_name}>
                          {i.vehicle?.owner_name || "Guest User"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-[11px] text-slate-500 truncate">
                          {i.vehicle?.vehicle_type || "N/A"} • {i.vehicle?.vehicle_color || "N/A"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-[11px] text-slate-600 truncate">{i.vehicle?.department || "External"}</div>
                        <div className="text-[10px] text-slate-400">{i.vehicle?.phone || "No Contact"}</div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                            i.status === "granted"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-rose-50 text-rose-700 border border-rose-100"
                          }`}
                        >
                          {i.status}
                        </span>
                      </td>
                      <td className="p-4 text-[11px] text-slate-400 font-medium">
                        {new Date(i.timestamp).toLocaleString([], { 
                          dateStyle: 'medium', 
                          timeStyle: 'short' 
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400 text-xs italic">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
