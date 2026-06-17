import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";
import StatsCard from "@/components/dashboard/stats-card";
import RecentNotes from "@/components/dashboard/recent-notes";
import UpcomingTasks from "@/components/dashboard/upcoming-tasks";
import { BookOpen, FileText, CheckSquare, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { count: subjectCount },
    { count: noteCount },
    { count: taskCount },
    { count: doneCount },
  ] = await Promise.all([
    supabase.from("subjects").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("notes").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("tasks").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("tasks").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "done"),
  ]);

  const { data: recentNotes } = await supabase
    .from("notes")
    .select("id, title, content, created_at, subject:subjects(id, name, color)")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(5);

  const { data: upcomingTasks } = await supabase
    .from("tasks")
    .select("id, title, status, priority, due_date, subject:subjects(id, name, color)")
    .eq("user_id", user.id)
    .neq("status", "done")
    .order("due_date", { ascending: true })
    .limit(5);

  const completionRate = taskCount ? Math.round(((doneCount ?? 0) / taskCount) * 100) : 0;
  const fullName = user.user_metadata?.full_name?.split(" ")[0] || "there";

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6 animate-fade-in">

        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Good {getGreeting()}, {fullName} 👋
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Here&apos;s what&apos;s happening with your studies today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Subjects" value={subjectCount ?? 0} icon={BookOpen} color="indigo" href="/subjects" />
          <StatsCard title="Notes" value={noteCount ?? 0} icon={FileText} color="violet" href="/notes" />
          <StatsCard title="Tasks" value={taskCount ?? 0} icon={CheckSquare} color="blue" href="/tasks" />
          <StatsCard title="Completion" value={`${completionRate}%`} icon={TrendingUp} color="emerald" href="/tasks" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentNotes notes={(recentNotes ?? []) as any} />
          <UpcomingTasks tasks={(upcomingTasks ?? []) as any} />
        </div>

      </div>
    </DashboardLayout>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}