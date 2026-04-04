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
    let mounted = true;

    const fetchIncidents = async () => {
      const res = await fetch("/api/incidents");
      const data: Incident[] = await res.json();
      if (mounted) setIncidents(data);
    };

    fetchIncidents();
    const interval = setInterval(fetchIncidents, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const filteredIncidents = useMemo(() => {
    const lower = search.toLowerCase();

    return !search
      ? incidents
      : incidents.filter((i) => {
          const owner = i.vehicle?.owner_name?.toLowerCase() || "";
          const plate = i.plate_number.toLowerCase();
          return plate.includes(lower) || owner.includes(lower);
        });
  }, [search, incidents]);

  const recent = incidents
    .filter((i) => i.status === "granted" && i.vehicle)
    .slice(0, 4);

  return (
    <Layout>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8">
        <header className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 pt-6">
            Vehicle Activity Logs
          </h1>
          <p className="text-slate-500 text-xs md:text-sm">
            Monitor real-time access and incident history.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {recent.length > 0 ? (
            recent.map((i) => (
              <div
                key={i.id}
                className="bg-white border border-emerald-100 p-4 rounded-xl shadow-sm"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Recent
                  </span>
                  <span className="text-[10px] text-slate-900">
                    {new Date(i.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-900 truncate">
                  {i.vehicle?.owner_name}
                </p>
                <p className="text-xs font-mono text-slate-900">
                  {i.plate_number}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-slate-500 py-4 text-xs bg-slate-50 rounded-lg border border-dashed">
              No recent activity recorded.
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Filter by plate or owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 text-sm p-2.5 pl-4 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="hidden md:block bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="p-4 text-left text-xs font-bold text-slate-900">
                    Plate
                  </th>
                  <th className="p-4 text-left text-xs font-bold text-slate-900">
                    Owner
                  </th>
                  <th className="p-4 text-left text-xs font-bold text-slate-900">
                    Type/Color
                  </th>
                  <th className="p-4 text-left text-xs font-bold text-slate-900">
                    Dept/Phone
                  </th>
                  <th className="p-4 text-left text-xs font-bold text-slate-900">
                    Status
                  </th>
                  <th className="p-4 text-left text-xs font-bold text-slate-900">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredIncidents.length > 0 ? (
                  filteredIncidents.map((i) => (
                    <tr key={i.id} className="border-b hover:bg-slate-50">
                      <td className="p-4 font-mono text-xs text-slate-900">
                        {i.plate_number}
                      </td>

                      <td className="p-4 text-xs text-slate-900">
                        {i.vehicle?.owner_name || "Guest User"}
                      </td>

                      <td className="p-4 text-xs text-slate-900">
                        {i.vehicle?.vehicle_type || "N/A"} •{" "}
                        {i.vehicle?.vehicle_color || "N/A"}
                      </td>

                      <td className="p-4 text-xs text-slate-900">
                        {i.vehicle?.department || "External"}
                        <div className="text-[10px] text-slate-500">
                          {i.vehicle?.phone || "No Contact"}
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                            i.status === "granted"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {i.status}
                        </span>
                      </td>

                      <td className="p-4 text-xs text-slate-500">
                        {new Date(i.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="md:hidden space-y-3">
          {filteredIncidents.length > 0 ? (
            filteredIncidents.map((i) => (
              <div
                key={i.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {i.plate_number}
                  </span>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      i.status === "granted"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {i.status}
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-900">
                  {i.vehicle?.owner_name || "Guest User"}
                </p>

                <p className="text-xs text-slate-500">
                  {i.vehicle?.vehicle_type || "N/A"} •{" "}
                  {i.vehicle?.vehicle_color || "N/A"}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {i.vehicle?.department || "External"} •{" "}
                  {i.vehicle?.phone || "No Contact"}
                </p>

                <p className="text-[10px] text-slate-400 mt-2">
                  {new Date(i.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-500 text-xs py-6">
              No records found.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}