export interface Note {
  id: string;
  user_id: string;
  subject_id?: string;
  title: string;
  content?: string;          // raw JSON from TipTap
  content_text?: string;     // plain-text version for search snippets
  is_pinned: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  subject?: {
    id: string;
    name: string;
    color: string;
  };
}

export interface CreateNoteInput {
  subject_id?: string;
  title: string;
  content?: string;
  content_text?: string;
}

export interface UpdateNoteInput extends Partial<CreateNoteInput> {
  is_pinned?: boolean;
  is_archived?: boolean;
}