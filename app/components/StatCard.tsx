import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
}

export default function StatCard({ title, value, icon }: StatCardProps) {

  const colorMap: Record<string, string> = {
    "Total Vehicles": "bg-blue-100 text-blue-600",
    "Vehicles Inside": "bg-green-100 text-green-600",
    "Incidents Today": "bg-yellow-100 text-yellow-600",
    "Access Denied": "bg-red-100 text-red-600",
  };

  const colorClasses = colorMap[title] || "bg-gray-100 text-gray-600";

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#1E1F20] text-sm">{title}</p>
          <h2 className="text-2xl font-bold mt-1 text-[#1E1F20]">{value}</h2>
        </div>

        <div className={`p-3 rounded-xl flex items-center justify-center ${colorClasses}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}