import DashboardLayout from '@/components/layout/dashboard-layout'
import { getTaskById } from '@/lib/actions/tasks'
import { getSubjects } from '@/lib/actions/subjects'
import TaskForm from '@/components/tasks/task-form'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

export default async function EditTaskPage({ params }: Props) {
  const [task, subjects] = await Promise.all([
    getTaskById(params.id).catch(() => null),
    getSubjects(),
  ])

  if (!task) notFound()

  return (
    <DashboardLayout title="Edit Task">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/tasks/${task.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Task
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Edit Task</h1>
          <p className="text-sm text-slate-500 mt-1 line-clamp-1">{task.title}</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <TaskForm
            subjects={subjects}
            initialData={{
              id: task.id,
              title: task.title,
              description: task.description,
              subject_id: task.subject_id,
              status: task.status,
              priority: task.priority,
              due_date: task.due_date,
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}