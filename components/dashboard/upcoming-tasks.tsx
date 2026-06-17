import Link from "next/link";
import { CheckSquare, ArrowRight, Clock } from "lucide-react";
import { clsx } from "clsx";
import { formatDistanceToNow } from "date-fns";

interface Subject {
  id: string;
  name: string;
  color: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date?: string;
  subject?: Subject | Subject[] | null;
}

const priorityMap: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-slate-100 text-slate-600",
};

const statusMap: Record<string, string> = {
  todo: "bg-slate-100 text-slate-600",
  in_progress: "bg-blue-100 text-blue-700",
  done: "bg-emerald-100 text-emerald-700",
};

const statusLabel: Record<string, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

function getSubject(subject: Subject | Subject[] | null | undefined): Subject | null {
  if (!subject) return null;
  if (Array.isArray(subject)) return subject[0] ?? null;
  return subject;
}

export default function UpcomingTasks({ tasks }: { tasks: Task[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CheckSquare size={16} className="text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-700">Upcoming Tasks</h3>
        </div>
        <Link
          href="/tasks"
          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
        >
          View all <ArrowRight size={12} />
        </Link>
      </div>

      <div className="divide-y divide-slate-50">
        {tasks.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <CheckSquare size={32} className="text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No pending tasks</p>
            <Link
              href="/tasks/create"
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium mt-1 inline-block"
            >
              Create your first task →
            </Link>
          </div>
        ) : (
          tasks.map((task) => {
            const subject = getSubject(task.subject);
            return (
              <Link key={task.id} href={`/tasks/${task.id}`}>
                <div className="px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {task.title}
                      </p>
                      {task.due_date && (
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <Clock size={10} />
                          Due {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className={clsx("text-xs px-2 py-0.5 rounded-md font-medium", priorityMap[task.priority])}>
                        {task.priority}
                      </span>
                      <span className={clsx("text-xs px-2 py-0.5 rounded-md font-medium", statusMap[task.status])}>
                        {statusLabel[task.status]}
                      </span>
                      {subject && (
                        <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-600">
                          {subject.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}