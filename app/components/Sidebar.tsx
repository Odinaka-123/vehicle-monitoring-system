"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  ShieldCheck,
  AlertTriangle,
  Settings,
  X,
} from "lucide-react";

// 1. Define the Props interface
interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Register Vehicle", icon: Car, path: "/register" },
    { name: "Gate Access", icon: ShieldCheck, path: "/gate-access" },
    { name: "Incidents", icon: AlertTriangle, path: "/incidents" },
    { name: "Admin", icon: Settings, path: "/admin" },
  ];

  return (
    <>
      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-gray-200 flex flex-col p-5 shadow-xl transition-transform duration-300 shrink-0
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold text-white tracking-tight">VMS</h1>

          {/* Close (mobile) */}
          <button 
            className="md:hidden p-1 hover:bg-slate-800 rounded-lg transition-colors" 
            onClick={() => setOpen(false)} 
            aria-label="close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Menu */}
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <li key={index}>
                <Link
                  href={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                      : "hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon
                    size={20}
                    className={`transition ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-blue-400"
                    }`}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-slate-800">
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
            Vehicle Monitoring System
          </p>
        </div>
      </div>
    </>
  );
}
