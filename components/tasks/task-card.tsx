'use client'

import Link from 'next/link'
import { useState } from 'react'
import { TaskStatus } from '@/types/task'
import TaskStatusBadge from './task-status-badge'
import { updateTaskStatus, deleteTask } from '@/lib/actions/tasks'

interface TaskCardProps {
  task: {
    id: string
    title: string
    description?: string | null
    status: TaskStatus
    priority: 'low' | 'medium' | 'high'
    due_date?: string | null
    subject?: { id: string; name: string; color: string } | null
  }
}

const priorityConfig = {
  low: { label: 'Low', className: 'text-slate-500 bg-slate-100' },
  medium: { label: 'Medium', className: 'text-amber-600 bg-amber-50' },
  high: { label: 'High', className: 'text-red-600 bg-red-50' },
}

function formatDueDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, overdue: true }
  if (diff === 0) return { label: 'Due today', overdue: false }
  if (diff === 1) return { label: 'Due tomorrow', overdue: false }
  return {
    label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    overdue: false,
  }
}

export default function TaskCard({ task }: TaskCardProps) {
  const [status, setStatus] = useState<TaskStatus>(task.status)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const priority = priorityConfig[task.priority]
  const due = task.due_date ? formatDueDate(task.due_date) : null

  const cycleStatus = async () => {
    const next: Record<TaskStatus, TaskStatus> = {
      todo: 'in_progress',
      in_progress: 'done',
      done: 'todo',
    }
    const newStatus = next[status]
    setLoading(true)
    setStatus(newStatus)
    try {
      await updateTaskStatus(task.id, newStatus)
    } catch {
      setStatus(status)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!confirm('Delete this task?')) return
    setDeleting(true)
    try {
      await deleteTask(task.id)
    } catch {
      setDeleting(false)
    }
  }

  return (
    <div
      className={`group relative bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition-all duration-200 ${deleting ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div
        className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-amber-400' : 'bg-slate-300'}`}
      />

      <div className="pl-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link
            href={`/tasks/${task.id}`}
            className="font-medium text-slate-800 hover:text-indigo-600 transition-colors line-clamp-2 flex-1"
          >
            {task.title}
          </Link>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <Link
              href={`/tasks/${task.id}/edit`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Edit"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-slate-500 line-clamp-2 mb-3">{task.description}</p>
        )}

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={cycleStatus}
              disabled={loading}
              title="Click to change status"
              className="cursor-pointer"
            >
              <TaskStatusBadge status={status} size="sm" />
            </button>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priority.className}`}>
              {priority.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {task.subject && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: task.subject.color }}
              >
                {task.subject.name}
              </span>
            )}
            {due && (
              <span className={`text-xs font-medium flex items-center gap-1 ${due.overdue ? 'text-red-500' : 'text-slate-400'}`}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {due.label}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}