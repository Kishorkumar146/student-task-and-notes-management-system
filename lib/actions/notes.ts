"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { CreateNoteInput, UpdateNoteInput } from "@/types/note";

export async function getNotes(subjectId?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from("notes")
    .select("*, subject:subjects(id, name, color)")
    .eq("user_id", user.id)
    .eq("is_archived", false)
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false });

  if (subjectId) query = query.eq("subject_id", subjectId);

  const { data } = await query;
  return data ?? [];
}

export async function getNote(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("notes")
    .select("*, subject:subjects(id, name, color)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  return data;
}

export async function createNote(input: CreateNoteInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("notes")
    .insert({ ...input, user_id: user.id, is_pinned: false, is_archived: false })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/notes");
  return data;
}

export async function updateNote(id: string, input: UpdateNoteInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("notes")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/notes");
  revalidatePath(`/notes/${id}`);
  return data;
}

export async function deleteNote(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/notes");
}

export async function togglePin(id: string, pinned: boolean) {
  return updateNote(id, { is_pinned: pinned });
}