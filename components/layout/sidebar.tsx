"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  CheckSquare,
  Calendar,
  User,
  GraduationCap,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/subjects", icon: BookOpen, label: "Subjects" },
  { href: "/notes", icon: FileText, label: "Notes" },
  { href: "/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={clsx(
      "h-screen sticky top-0 flex flex-col bg-white border-r border-slate-200 transition-all duration-300",
      collapsed ? "w-16" : "w-60"
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100">
        <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <GraduationCap size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-slate-900 text-sm tracking-tight">
            StudySpace
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx(
            "ml-auto p-1 rounded-md hover:bg-slate-100 text-slate-400 transition-all",
            collapsed && "rotate-180"
          )}
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon size={18} className={clsx("flex-shrink-0", active ? "text-indigo-600" : "text-slate-400")} />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom hint */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center">StudySpace v1.0</p>
        </div>
      )}
    </aside>
  );
}