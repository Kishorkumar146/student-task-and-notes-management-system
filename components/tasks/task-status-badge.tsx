import { TaskStatus } from '@/types/task'

interface TaskStatusBadgeProps {
  status: TaskStatus
  size?: 'sm' | 'md'
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  todo: {
    label: 'To Do',
    className: 'bg-slate-100 text-slate-600 border border-slate-200',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-blue-50 text-blue-600 border border-blue-200',
  },
  done: {
    label: 'Done',
    className: 'bg-green-50 text-green-600 border border-green-200',
  },
}

export default function TaskStatusBadge({ status, size = 'md' }: TaskStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}
        ${config.className}
      `}
    >
      <span
        className={`
          rounded-full
          ${size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'}
          ${status === 'todo' ? 'bg-slate-400' : ''}
          ${status === 'in_progress' ? 'bg-blue-500' : ''}
          ${status === 'done' ? 'bg-green-500' : ''}
        `}
      />
      {config.label}
    </span>
  )
}