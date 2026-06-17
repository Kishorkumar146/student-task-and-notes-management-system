import DashboardLayout from '@/components/layout/dashboard-layout'
import { getTasks } from '@/lib/actions/tasks'
import { getSubjects } from '@/lib/actions/subjects'
import TaskCard from '@/components/tasks/task-card'
import Link from 'next/link'

export default async function TasksPage() {
  const [tasks, subjects] = await Promise.all([getTasks(), getSubjects()])

  const todo = tasks.filter(t => t.status === 'todo')
  const inProgress = tasks.filter(t => t.status === 'in_progress')
  const done = tasks.filter(t => t.status === 'done')

  return (
    <DashboardLayout title="Tasks">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Tasks</h1>
            <p className="text-sm text-slate-500 mt-1">
              {tasks.length} total · {inProgress.length} in progress · {todo.length} to do
            </p>
          </div>
          <Link
            href="/tasks/create"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </Link>
        </div>

        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-700 mb-1">No tasks yet</h3>
            <p className="text-sm text-slate-400 mb-6">Create your first task to get started</p>
            <Link
              href="/tasks/create"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Create Task
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* To Do */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  To Do
                </h2>
                <span className="ml-auto text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {todo.length}
                </span>
              </div>
              <div className="space-y-3">
                {todo.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                    No tasks
                  </p>
                ) : (
                  todo.map(task => <TaskCard key={task.id} task={task} />)
                )}
              </div>
            </div>

            {/* In Progress */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  In Progress
                </h2>
                <span className="ml-auto text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {inProgress.length}
                </span>
              </div>
              <div className="space-y-3">
                {inProgress.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                    No tasks
                  </p>
                ) : (
                  inProgress.map(task => <TaskCard key={task.id} task={task} />)
                )}
              </div>
            </div>

            {/* Done */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  Done
                </h2>
                <span className="ml-auto text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {done.length}
                </span>
              </div>
              <div className="space-y-3">
                {done.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                    No tasks
                  </p>
                ) : (
                  done.map(task => <TaskCard key={task.id} task={task} />)
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
                  