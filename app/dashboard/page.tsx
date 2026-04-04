"use client";

import { useEffect, useState } from "react";
import Layout from "@/app/components/Layout";
import StatCard from "@/app/components/StatCard";
import VehicleChart from "@/app/components/VehicleChart";
import VehiclePie from "@/app/components/VehiclePie";

import { Car, ShieldCheck, AlertTriangle, Ban } from "lucide-react";

type Stats = {
  totalVehicles: number;
  vehiclesInside: number;
  incidentsToday: number;
  deniedToday: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalVehicles: 0,
    vehiclesInside: 0,
    incidentsToday: 0,
    deniedToday: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      {/* Responsive padding and text size */}
      <div className="p-4 md:p-0">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#1E1F20]">
          Dashboard
        </h1>

        {/* STATS GRID: 1 col on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Vehicles"
            value={stats.totalVehicles.toString()}
            icon={<Car className="w-5 h-5" />}
          />

          <StatCard
            title="Vehicles Inside"
            value={stats.vehiclesInside.toString()}
            icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />}
          />

          <StatCard
            title="Incidents Today"
            value={stats.incidentsToday.toString()}
            icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
          />

          <StatCard
            title="Access Denied"
            value={stats.deniedToday.toString()}
            icon={<Ban className="w-5 h-5 text-rose-500" />}
          />
        </div>

        {/* CHARTS GRID: Stacked on mobile/tablet, side-by-side on large screens */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="w-full overflow-hidden">
            <VehicleChart />
          </div>
          <div className="w-full overflow-hidden">
            <VehiclePie />
          </div>
        </div>
      </div>
    </Layout>
  );
}
