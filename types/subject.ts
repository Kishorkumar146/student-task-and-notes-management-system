export type SubjectColor =
  | "indigo"
  | "violet"
  | "blue"
  | "emerald"
  | "amber"
  | "rose"
  | "orange"
  | "teal";

export interface Subject {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: SubjectColor;
  icon?: string;
  created_at: string;
  updated_at: string;
  _count?: {
    notes: number;
    tasks: number;
  };
}

export interface CreateSubjectInput {
  name: string;
  description?: string;
  color: SubjectColor;
  icon?: string;
}