import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { clsx } from "clsx";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: "indigo" | "violet" | "blue" | "emerald";
  href: string;
}

const colorMap = {
  indigo: {
    bg: "bg-indigo-50",
    icon: "text-indigo-600",
    badge: "bg-indigo-100 text-indigo-700",
  },
  violet: {
    bg: "bg-violet-50",
    icon: "text-violet-600",
    badge: "bg-violet-100 text-violet-700",
  },
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
  },
};

export default function StatsCard({ title, value, icon: Icon, color, href }: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <Link href={href}>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-500">{title}</span>
          <div className={clsx("p-2 rounded-lg", colors.bg)}>
            <Icon size={16} className={colors.icon} />
          </div>
        </div>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </div>
    </Link>
  );
}