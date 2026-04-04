"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Car,
  ShieldCheck,
  AlertTriangle,
  Settings,
  X,
  LogOutIcon,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter(); // ✅ needed for navigation
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Register Vehicle", icon: Car, path: "/register" },
    { name: "Gate Access", icon: ShieldCheck, path: "/gate-access" },
    { name: "Incidents", icon: AlertTriangle, path: "/incidents" },
    { name: "Admin", icon: Settings, path: "/admin" },
    {
      name: "Logout",
      icon: LogOutIcon,
      action: () => setShowLogoutModal(true),
    },
  ];

  return (
    <>
      {/* Overlay */}
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
                <button
                  onClick={() => {
                    setOpen(false);
                    if (item.action) {
                      item.action(); // logout modal
                    } else if (item.path) {
                      router.push(item.path); // navigate for links
                    }
                  }}
                  className={`flex items-center gap-3 p-3 w-full text-left rounded-xl transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                        : "hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  <Icon
                    size={20}
                    className={`transition ${
                      isActive ? "text-white" : "text-gray-400 group-hover:text-blue-400"
                    }`}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
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

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <LogOutIcon size={40} className="mx-auto text-red-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Logout?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmLogout}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}