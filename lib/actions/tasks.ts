'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { TaskStatus, TaskPriority } from '@/types/task'

export async function getTasks() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('tasks')
    .select('*, subject:subjects(id, name, color)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getTaskById(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('tasks')
    .select('*, subject:subjects(id, name, color)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getTasksBySubject(subjectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('tasks')
    .select('*, subject:subjects(id, name, color)')
    .eq('user_id', user.id)
    .eq('subject_id', subjectId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function createTask(formData: {
  title: string
  description?: string
  subject_id?: string
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      ...formData,
      user_id: user.id,
      status: formData.status ?? 'todo',
      priority: formData.priority ?? 'medium',
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/tasks')
  return data
}

export async function updateTask(id: string, formData: {
  title?: string
  description?: string
  subject_id?: string
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('tasks')
    .update(formData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/tasks')
  revalidatePath(`/tasks/${id}`)
  return data
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath('/tasks')
  revalidatePath(`/tasks/${id}`)
  return data
}

export async function deleteTask(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/tasks')
}

export async function getUpcomingTasks(limit = 5) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('tasks')
    .select('*, subject:subjects(id, name, color)')
    .eq('user_id', user.id)
    .neq('status', 'done')
    .not('due_date', 'is', null)
    .gte('due_date', new Date().toISOString())
    .order('due_date', { ascending: true })
    .limit(limit)

  if (error) throw new Error(error.message)
  return data
}