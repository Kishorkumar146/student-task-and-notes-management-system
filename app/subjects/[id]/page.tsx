import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";
import SubjectForm from "@/components/subjects/subject-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditSubjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: subject } = await supabase
    .from("subjects")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!subject) notFound();

  return (
    <DashboardLayout title="Edit Subject">
      <div className="max-w-lg mx-auto">

        <Link
          href="/subjects"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Subjects
        </Link>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Edit Subject</h2>
            <p className="text-slate-500 text-sm mt-1">Update your subject details.</p>
          </div>
          <SubjectForm
            defaultValues={{
              id: subject.id,
              name: subject.name,
              description: subject.description,
              color: subject.color,
              icon: subject.icon,
            }}
          />
        </div>

      </div>
    </DashboardLayout>
  );
}