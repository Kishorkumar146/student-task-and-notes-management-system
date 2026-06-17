import DashboardLayout from "@/components/layout/dashboard-layout";
import SubjectForm from "@/components/subjects/subject-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateSubjectPage() {
  return (
    <DashboardLayout title="Create Subject">
      <div className="max-w-lg mx-auto">

        {/* Back */}
        <Link
          href="/subjects"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Subjects
        </Link>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">Create Subject</h2>
            <p className="text-slate-500 text-sm mt-1">
              Add a new subject to organize your notes and tasks.
            </p>
          </div>
          <SubjectForm />
        </div>

      </div>
    </DashboardLayout>
  );
}