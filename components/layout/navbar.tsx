"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, Bell, Search } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  title?: string;
}

export default function Navbar({ title }: NavbarProps) {
  const router = useRouter();
  const supabase = createClient();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-6 gap-4 sticky top-0 z-30">
      {/* Title */}
      <h1 className="text-base font-semibold text-slate-900 flex-1">
        {title}
      </h1>

      {/* Search */}
      <button
        onClick={() => setSearchOpen(!searchOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all text-sm"
      >
        <Search size={14} />
        <span className="hidden sm:inline text-xs">Search...</span>
        <kbd className="hidden sm:inline text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-400">⌘K</kbd>
      </button>

      {/* Bell */}
      <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
        <Bell size={16} />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-all text-sm font-medium border border-transparent hover:border-red-100"
      >
        <LogOut size={14} />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </header>
  );
}