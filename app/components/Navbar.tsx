"use client";

import { Menu } from "lucide-react";
interface NavbarProps {
  setOpen: (open: boolean) => void;
}

export default function Navbar({ setOpen }: NavbarProps) {
  return (
    <div className="md:hidden flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
      <h1 className="text-xl font-bold tracking-tight">VMS</h1>

      <button
        onClick={() => setOpen(true)}
        className="p-2 hover:bg-slate-800 rounded-lg transition-colors active:scale-95"
        aria-label="open menu"
      >
        <Menu size={24} />
      </button>
    </div>
  );
}
