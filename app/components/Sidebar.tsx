"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname(); 

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Register Vehicle", icon: Car, path: "/register" },
    { name: "Gate Access", icon: ShieldCheck, path: "/gate" },
    { name: "Access Logs", icon: FileText, path: "/logs" },
    { name: "Incidents", icon: AlertTriangle, path: "/incidents" },
    { name: "Admin", icon: Settings, path: "/admin" },
  ];

  return (
    <div className="w-64 bg-linear-to-b from-slate-900 to-slate-800 text-gray-200 flex flex-col p-5 shadow-xl">
      <h1 className="text-2xl font-bold mb-10 tracking-wide text-white">VMS</h1>

      <ul className="space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.path; // check active

          return (
            <li key={index}>
              <a
                href={item.path}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
                  ${isActive ? "bg-blue-600 text-white" : "hover:bg-slate-700 hover:text-white"}`}
              >
                <Icon
                  size={20}
                  className={`transition ${isActive ? "text-white" : "text-gray-400 group-hover:text-blue-400"}`}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto pt-6 border-t border-slate-700">
        <p className="text-xs text-gray-400">Vehicle Monitoring System</p>
      </div>
    </div>
  );
}