'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTask, updateTask } from '@/lib/actions/tasks'
import { TaskStatus, TaskPriority } from '@/types/task'

interface Subject {
  id: string
  name: string
  color: string
}

interface TaskFormProps {
  subjects: Subject[]
  initialData?: {
    id: string
    title: string
    description?: string | null
    subject_id?: string | null
    status: TaskStatus
    priority: TaskPriority
    due_date?: string | null
  }
}

export default function TaskForm({ subjects, initialData }: TaskFormProps) {
  const router = useRouter()
  const isEditing = !!initialData

  const [form, setForm] = useState({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    subject_id: initialData?.subject_id ?? '',
    status: initialData?.status ?? 'todo' as TaskStatus,
    priority: initialData?.priority ?? 'medium' as TaskPriority,
    due_date: initialData?.due_date
      ? new Date(initialData.due_date).toISOString().slice(0, 16)
      : '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return setError('Title is required')

    setLoading(true)
    setError('')

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description || undefined,
        subject_id: form.subject_id || undefined,
        status: form.status,
        priority: form.priority,
        due_date: form.due_date || undefined,
      }

      if (isEditing) {
        await updateTask(initialData.id, payload)
        router.push(`/tasks/${initialData.id}`)
      } else {
        const task = await createTask(payload)
        router.push(`/tasks/${task.id}`)
      }
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="e.g. Complete assignment 3"
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Add more details..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Subject
        </label>
        <select
          value={form.subject_id}
          onChange={e => setForm(f => ({ ...f, subject_id: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
        >
          <option value="">No subject</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Priority & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Priority
          </label>
          <select
            value={form.priority}
            onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Status
          </label>
          <select
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value as TaskStatus }))}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Due Date
        </label>
        <input
          type="datetime-local"
          value={form.due_date}
          onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Task'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}