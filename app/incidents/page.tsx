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

  // Fetch all incidents on mount
  useEffect(() => {
    const fetchIncidents = async () => {
      const res = await fetch("/api/incidents");
      const data: Incident[] = await res.json();
      setIncidents(data);
    };
    fetchIncidents();
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
    .slice(0, 5);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Vehicles Log & Incidents
      </h1>

      {/* Recent Approved Vehicles */}
      <div className="mb-6 max-w-3xl mx-auto grid gap-4 sm:grid-cols-2">
        {recent.length > 0
          ? recent.map((i) => (
              <div
                key={i.id}
                className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm flex flex-col justify-center"
              >
                <p className="text-green-700 font-semibold">
                  {i.vehicle?.owner_name}
                </p>
                <p className="text-gray-700">{i.plate_number}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(i.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          : (
              <div className="col-span-full text-center text-gray-500 p-6 bg-gray-50 rounded-lg">
                No vehicles registered yet.
              </div>
            )}
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-4">
        <input
          type="text"
          placeholder="Search by plate number or owner name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400 transition text-[#1E1F20]"
        />
      </div>

      {/* Incidents Table */}
      <div className="bg-white p-6 rounded-2xl shadow max-w-5xl mx-auto overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100 rounded-t-lg">
            <tr>
              {[
                "Plate Number",
                "Owner Name",
                "Vehicle Type",
                "Color",
                "Department",
                "Phone",
                "Status",
                "Timestamp",
              ].map((header) => (
                <th
                  key={header}
                  className="p-3 text-left text-gray-700 font-medium uppercase text-xs tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredIncidents.length > 0
              ? filteredIncidents.map((i, idx) => (
                  <tr
                    key={i.id}
                    className={`border-t hover:bg-gray-50 transition ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="p-3">{i.plate_number}</td>
                    <td className="p-3">{i.vehicle?.owner_name || "Unknown"}</td>
                    <td className="p-3">{i.vehicle?.vehicle_type || "-"}</td>
                    <td className="p-3">{i.vehicle?.vehicle_color || "-"}</td>
                    <td className="p-3">{i.vehicle?.department || "-"}</td>
                    <td className="p-3">{i.vehicle?.phone || "-"}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          i.status === "granted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {i.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500 text-sm">
                      {new Date(i.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              : (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center p-4 text-gray-500 font-medium"
                  >
                    No results found.
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}