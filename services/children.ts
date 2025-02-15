import { supabase } from '../lib/supabase'
import { Child, CreateChildInput, UpdateChildInput } from '../types/child'

export async function getChildren(userId: string): Promise<Child[]> {
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function createChild(userId: string, input: CreateChildInput): Promise<Child> {
  const { data, error } = await supabase
    .from('children')
    .insert([
      {
        user_id: userId,
        name: input.name,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateChild(childId: string, input: UpdateChildInput): Promise<Child> {
  const { data, error } = await supabase
    .from('children')
    .update(input)
    .eq('id', childId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteChild(childId: string): Promise<void> {
  const { error } = await supabase
    .from('children')
    .delete()
    .eq('id', childId)

  if (error) throw error
} 