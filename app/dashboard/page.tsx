import Layout from "@/app/components/Layout";
import StatCard from "@/app/components/StatCard";
import VehicleChart from "@/app/components/VehicleChart";
import VehiclePie from "@/app/components/VehiclePie";

import { Car, ShieldCheck, AlertTriangle, Ban } from "lucide-react";

export default function Dashboard() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6 text-[#1E1F20]">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Vehicles" value="120" icon={<Car />} />

        <StatCard title="Vehicles Inside" value="45" icon={<ShieldCheck />} />

        <StatCard title="Incidents Today" value="3" icon={<AlertTriangle />} />

        <StatCard title="Access Denied" value="5" icon={<Ban />} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <VehicleChart />
        <VehiclePie />
      </div>
    </Layout>
  );
}
