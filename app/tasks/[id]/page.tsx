import DashboardLayout from '@/components/layout/dashboard-layout'
import { getTaskById } from '@/lib/actions/tasks'
import TaskStatusBadge from '@/components/tasks/task-status-badge'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: { id: string }
}

const priorityConfig = {
  low: { label: 'Low', className: 'text-slate-600 bg-slate-100' },
  medium: { label: 'Medium', className: 'text-amber-600 bg-amber-50' },
  high: { label: 'High', className: 'text-red-600 bg-red-50' },
}

const subjectColors: Record<string, string> = {
  indigo: 'bg-indigo-600',
  violet: 'bg-violet-600',
  blue: 'bg-blue-600',
  emerald: 'bg-emerald-600',
  amber: 'bg-amber-600',
  rose: 'bg-rose-600',
  orange: 'bg-orange-600',
  teal: 'bg-teal-600',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function isOverdue(dateStr: string) {
  return new Date(dateStr) < new Date()
}

export default async function TaskDetailPage({ params }: Props) {
  const task = await getTaskById(params.id).catch(() => null)
  if (!task) notFound()

  const priority = priorityConfig[task.priority as keyof typeof priorityConfig]

  return (
    <DashboardLayout title="Task Details">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Tasks
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div
            className={`h-1.5 w-full
              ${task.priority === 'high' ? 'bg-red-400' : ''}
              ${task.priority === 'medium' ? 'bg-amber-400' : ''}
              ${task.priority === 'low' ? 'bg-slate-300' : ''}
            `}
          />

          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold text-slate-800 leading-snug">
                {task.title}
              </h1>
              <Link
                href={`/tasks/${task.id}/edit`}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
              >
                Edit
              </Link>
            </div>

            <div className="flex items-center gap-2 flex-wrap mb-6">
              <TaskStatusBadge status={task.status} />
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${priority.className}`}>
                {priority.label} Priority
              </span>
              {task.subject && (
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full text-white ${subjectColors[task.subject.color] ?? 'bg-slate-400'}`}
                >
                  {task.subject.name}
                </span>
              )}
            </div>

            {task.description && (
              <div className="mb-6">
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Description
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
              {task.due_date && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                    Due Date
                  </p>
                  <p className={`text-sm font-medium ${isOverdue(task.due_date) && task.status !== 'done' ? 'text-red-500' : 'text-slate-700'}`}>
                    {formatDate(task.due_date)}
                    {isOverdue(task.due_date) && task.status !== 'done' && (
                      <span className="ml-2 text-xs text-red-400">(Overdue)</span>
                    )}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                  Created
                </p>
                <p className="text-sm text-slate-700">{formatDate(task.created_at)}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                  Last Updated
                </p>
                <p className="text-sm text-slate-700">{formatDate(task.updated_at)}</p>
              </div>

              {task.subject && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                    Subject
                  </p>
                  <Link
                    href={`/subjects/${task.subject.id}`}
                    className="text-sm font-medium text-indigo-600 hover:underline"
                  >
                    {task.subject.name}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}