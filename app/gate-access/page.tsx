"use client";
import React, { useState } from "react";
import Layout from "@/app/components/Layout";
import { CheckCircle, XCircle, Car } from "lucide-react";

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


type Result = {
  status: "granted" | "denied";
  vehicle?: Vehicle;
  message?: string;
};

export default function GateAccess() {
  const [plate, setPlate] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
  const res = await fetch("/api/check-vehicle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plate_number: plate }),
  });

  const data: Result = await res.json();
  setResult(data);
} catch (err) {
  console.error("Gate check failed:", err); 
  setResult({ status: "denied", message: "Server error. Try again." });
}
  };

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
            className={`mt-6 p-4 rounded-lg text-center text-white shadow-lg transform transition-all duration-300 ${
              result.status === "granted" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {result.status === "granted" && result.vehicle ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className="w-10 h-10" />
                <p className="text-xl font-semibold">Access Granted!</p>
                <div className="flex items-center gap-2 bg-white rounded-lg p-2 text-gray-900 w-full justify-center shadow">
                  <Car className="w-5 h-5" />
                  <span>
                    {result.vehicle.owner_name} - {result.vehicle.plate_number}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <XCircle className="w-10 h-10" />
                <p className="text-xl font-semibold">
                  {result.message || "Access Denied"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}