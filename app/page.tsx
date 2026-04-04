"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  // Optional: redirect logged-in users immediately
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed.role === "admin") router.push("/admin");
      else router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-linear-to-tr from-blue-900 via-slate-900 to-purple-900 flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Glowing background accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-linear-to-tr from-yellow-400 via-orange-500 to-pink-500 opacity-20 blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-linear-to-bl from-cyan-400 via-blue-500 to-purple-600 opacity-20 blur-3xl animate-pulse-slow"></div>

      <div className="relative z-10 max-w-md w-full bg-slate-800 rounded-3xl shadow-2xl overflow-hidden p-10 text-center animate-fadeIn">
        {/* Brand */}
        <div className="flex justify-center items-center gap-3 mb-4">
          <ShieldIcon />
          <span className="text-4xl font-extrabold text-white tracking-tight">VMS</span>
        </div>
        <p className="text-gray-300 mb-8">Vehicle Monitoring System</p>

        <h1 className="text-2xl text-white font-bold mb-2">Welcome</h1>
        <p className="text-gray-400 mb-6">Manage vehicle access, monitor activity, and control entry in real-time.</p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row justify-center">
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 bg-linear-to-r from-blue-600 via-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
          >
            Login
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          Access restricted · All activity logged
        </p>
      </div>
    </div>
  );
}

/* ── Icon ── */
function ShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z" fill="#f59e0b" opacity="0.9"/>
      <path d="M9 12l2 2 4-4" stroke="#0a0f1e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}