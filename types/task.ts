export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  user_id: string;
  subject_id?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  subject?: {
    id: string;
    name: string;
    color: string;
  };
}

export interface CreateTaskInput {
  subject_id?: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  is_archived?: boolean;
}