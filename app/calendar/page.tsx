import DashboardLayout from '@/components/layout/dashboard-layout'
import { getTasks } from '@/lib/actions/tasks'
import Link from 'next/link'

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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

export default async function CalendarPage() {
  const tasks = await getTasks()

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  // Group tasks by date
  const tasksByDate: Record<string, typeof tasks> = {}
  tasks.forEach(task => {
    if (!task.due_date) return
    const date = new Date(task.due_date)
    if (date.getFullYear() === year && date.getMonth() === month) {
      const key = date.getDate().toString()
      if (!tasksByDate[key]) tasksByDate[key] = []
      tasksByDate[key].push(task)
    }
  })

  const today = now.getDate()

  // Build calendar grid
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <DashboardLayout title="Calendar">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Calendar</h1>
            <p className="text-sm text-slate-500 mt-1">
              {MONTHS[month]} {year}
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

        {/* Calendar */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-slate-200">
            {DAYS.map(day => (
              <div
                key={day}
                className="py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wide"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {cells.map((day, idx) => {
              const isToday = day === today
              const dayTasks = day ? (tasksByDate[day.toString()] ?? []) : []
              const isLastRow = idx >= cells.length - 7

              return (
                <div
                  key={idx}
                  className={`min-h-[100px] p-2 border-b border-r border-slate-100
                    ${isLastRow ? 'border-b-0' : ''}
                    ${idx % 7 === 6 ? 'border-r-0' : ''}
                    ${!day ? 'bg-slate-50/50' : 'hover:bg-slate-50 transition-colors'}
                  `}
                >
                  {day && (
                    <>
                      {/* Day number */}
                      <div className="flex items-center justify-end mb-1">
                        <span
                          className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium
                            ${isToday
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                            }
                          `}
                        >
                          {day}
                        </span>
                      </div>

                      {/* Tasks */}
                      <div className="space-y-1">
                        {dayTasks.slice(0, 3).map(task => (
                          <Link
                            key={task.id}
                            href={`/tasks/${task.id}`}
                            className={`block text-xs px-1.5 py-0.5 rounded truncate font-medium transition-opacity hover:opacity-80
                              ${task.status === 'done'
                                ? 'bg-green-100 text-green-700 line-through'
                                : task.priority === 'high'
                                ? 'bg-red-100 text-red-700'
                                : task.priority === 'medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                              }
                            `}
                          >
                            {task.title}
                          </Link>
                        ))}
                        {dayTasks.length > 3 && (
                          <p className="text-xs text-slate-400 px-1">
                            +{dayTasks.length - 3} more
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming tasks with due dates */}
        <div className="mt-8">
          <h2 className="text-base font-semibold text-slate-700 mb-4">
            Tasks this month
          </h2>
          {Object.keys(tasksByDate).length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-400 text-sm">No tasks with due dates this month</p>
              <Link
                href="/tasks/create"
                className="inline-block mt-3 text-sm text-indigo-600 font-medium hover:underline"
              >
                Add a task with a due date
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(tasksByDate)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([day, dayTasks]) => (
                  <div key={day} className="flex gap-4 bg-white rounded-xl border border-slate-200 p-4">
                    <div className="shrink-0 w-12 text-center">
                      <p className="text-2xl font-bold text-slate-800">{day}</p>
                      <p className="text-xs text-slate-400">{MONTHS[month].slice(0, 3)}</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {dayTasks.map(task => (
                        <Link
                          key={task.id}
                          href={`/tasks/${task.id}`}
                          className="flex items-center gap-2 group"
                        >
                          <span
                            className={`w-2 h-2 rounded-full shrink-0
                              ${task.status === 'done' ? 'bg-green-500' : ''}
                              ${task.status === 'in_progress' ? 'bg-blue-500' : ''}
                              ${task.status === 'todo' ? 'bg-slate-300' : ''}
                            `}
                          />
                          <span className={`text-sm font-medium group-hover:text-indigo-600 transition-colors
                            ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-700'}
                          `}>
                            {task.title}
                          </span>
                          {task.subject && (
                            <span
                              className={`ml-auto text-xs px-2 py-0.5 rounded-full text-white shrink-0 ${subjectColors[task.subject.color] ?? 'bg-slate-400'}`}
                            >
                              {task.subject.name}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}