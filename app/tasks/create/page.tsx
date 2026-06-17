import DashboardLayout from '@/components/layout/dashboard-layout'
import { getSubjects } from '@/lib/actions/subjects'
import TaskForm from '@/components/tasks/task-form'
import Link from 'next/link'

export default async function CreateTaskPage() {
  const subjects = await getSubjects()

  return (
    <DashboardLayout title="New Task">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/tasks"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tasks
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">New Task</h1>
          <p className="text-sm text-slate-500 mt-1">Add a new task to your list</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <TaskForm subjects={subjects} />
        </div>
      </div>
    </DashboardLayout>
  )
}