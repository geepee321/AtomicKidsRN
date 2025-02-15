import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './auth'

type Child = {
  id: string
  name: string
  created_at: string
  user_id: string
  streak: number
  last_completed_at: string | null
}

type ChildrenContextType = {
  children: Child[]
  loading: boolean
  error: string | null
  refreshChildren: () => Promise<void>
  addChild: (name: string) => Promise<void>
  updateChild: (id: string, name: string) => Promise<void>
  deleteChild: (id: string) => Promise<void>
  updateStreak: (id: string, increment: boolean) => Promise<void>
}

const ChildrenContext = createContext<ChildrenContextType | undefined>(undefined)

export function ChildrenProvider({ children: childrenProp }: { children: React.ReactNode }) {
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const refreshChildren = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('children')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError

      setChildren(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const addChild = async (name: string) => {
    try {
      setError(null)
      const { data, error: insertError } = await supabase
        .from('children')
        .insert([{ 
          name, 
          user_id: user?.id,
          avatar_id: '1' // Default avatar
        }])
        .select()
        .single()

      if (insertError) throw insertError

      setChildren(prev => [...prev, data])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const updateChild = async (id: string, name: string) => {
    try {
      setError(null)
      const { error: updateError } = await supabase
        .from('children')
        .update({ name })
        .eq('id', id)
        .eq('user_id', user?.id)

      if (updateError) throw updateError

      setChildren(prev => prev.map(child => 
        child.id === id ? { ...child, name } : child
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const deleteChild = async (id: string) => {
    try {
      setError(null)
      
      // First, delete all tasks belonging to this child
      const { error: deleteTasksError } = await supabase
        .from('tasks')
        .delete()
        .eq('child_id', id)

      if (deleteTasksError) throw deleteTasksError

      // Then delete the child
      const { error: deleteError } = await supabase
        .from('children')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (deleteError) throw deleteError

      setChildren(prev => prev.filter(child => child.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const updateStreak = async (id: string, increment: boolean) => {
    try {
      setError(null)
      const child = children.find(c => c.id === id)
      if (!child) return

      const newStreak = increment ? (child.streak + 1) : 0
      const now = new Date().toISOString()

      const { error: updateError } = await supabase
        .from('children')
        .update({ 
          streak: newStreak,
          last_completed_at: increment ? now : null
        })
        .eq('id', id)
        .eq('user_id', user?.id)

      if (updateError) throw updateError

      setChildren(prev => prev.map(child => 
        child.id === id ? { 
          ...child, 
          streak: newStreak,
          last_completed_at: increment ? now : null
        } : child
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  useEffect(() => {
    if (user) {
      refreshChildren()
    }
  }, [user])

  return (
    <ChildrenContext.Provider 
      value={{ 
        children, 
        loading, 
        error, 
        refreshChildren, 
        addChild,
        updateChild,
        deleteChild,
        updateStreak
      }}
    >
      {childrenProp}
    </ChildrenContext.Provider>
  )
}

export function useChildren() {
  const context = useContext(ChildrenContext)
  if (context === undefined) {
    throw new Error('useChildren must be used within a ChildrenProvider')
  }
  return context
} 