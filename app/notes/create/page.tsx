import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";
import NoteForm from "@/components/notes/note-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function CreateNotePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name, color")
    .eq("user_id", user.id)
    .order("name");

  return (
    <DashboardLayout title="Create Note">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/notes"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Notes
        </Link>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <NoteForm subjects={subjects ?? []} />
        </div>
      </div>
    </DashboardLayout>
  );
}