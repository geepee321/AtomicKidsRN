import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './auth'
import { sortBy } from 'lodash'
import { PostgrestError } from '@supabase/supabase-js'

export type Task = {
  id: string
  title: string
  child_id: string | null
  completed: boolean
  completed_at: string | null
  created_at: string
  user_id: string
  order: number
  icon_name: string
}

type TasksContextType = {
  tasks: Task[]
  loading: boolean
  error: string | null
  refreshTasks: () => Promise<void>
  addTask: (task: { title: string; child_id?: string; icon_name: string }) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  reorderTasks: (tasks: Task[]) => Promise<void>
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

const handleSupabaseError = async (error: PostgrestError) => {
  if (error.code === 'PGRST301') {
    // JWT has expired, try to refresh the session
    const { data, error: refreshError } = await supabase.auth.refreshSession()
    if (refreshError) {
      throw new Error('Session refresh failed: ' + refreshError.message)
    }
    return data.session
  }
  throw error
}

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const reorderTasks = async (reorderedTasks: Task[]) => {
    try {
      setError(null)

      if (!user) {
        throw new Error('No user logged in')
      }
      
      // Only update the order field, preserve all other fields
      const updates = reorderedTasks.map((task, index) => ({
        ...task,  // Keep all existing task fields
        order: index
      }))

      const { error: updateError } = await supabase
        .from('tasks')
        .upsert(updates, {
          onConflict: 'id'
        })

      if (updateError) {
        console.error('Update error:', updateError)
        throw updateError
      }

      setTasks(sortBy(reorderedTasks.map((task, index) => ({
        ...task,
        order: index
      })), 'order'))
    } catch (err) {
      console.error('Error in reorderTasks:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const refreshTasks = async () => {
    try {
      setError(null)
      setLoading(true)

      if (!user) {
        throw new Error('No user logged in')
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('order')

      if (error) {
        // Try to handle JWT expiration
        await handleSupabaseError(error)
        // If handled successfully, retry the query
        const { data: retryData, error: retryError } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('order')
        
        if (retryError) throw retryError
        setTasks(retryData || [])
      } else {
        setTasks(data || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching tasks')
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (task: { title: string; child_id?: string; icon_name: string }) => {
    try {
      setError(null)
      
      // Get the maximum order value
      const { data: maxOrderData, error: maxOrderError } = await supabase
        .from('tasks')
        .select('order')
        .eq('user_id', user?.id)
        .order('order', { ascending: false })
        .limit(1)
        .single()

      if (maxOrderError && maxOrderError.code !== 'PGRST116') throw maxOrderError
      
      const nextOrder = (maxOrderData?.order ?? -1) + 1

      const { data, error: insertError } = await supabase
        .from('tasks')
        .insert([{ 
          ...task,
          user_id: user?.id,
          completed: false,
          order: nextOrder
        }])
        .select()
        .single()

      if (insertError) throw insertError

      setTasks(prev => sortBy([...prev, data], 'order'))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      setError(null)

      // If we're updating completion status, add completion timestamp
      if ('completed' in updates) {
        const now = new Date()
        updates = {
          ...updates,
          completed_at: updates.completed ? now.toISOString() : null
        }
      }

      const { error: updateError } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)

      if (updateError) throw updateError

      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  const deleteTask = async (id: string) => {
    try {
      setError(null)
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

      if (deleteError) throw deleteError

      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    }
  }

  useEffect(() => {
    if (user) {
      refreshTasks()
    }
  }, [user])

  return (
    <TasksContext.Provider 
      value={{ 
        tasks, 
        loading, 
        error, 
        refreshTasks, 
        addTask,
        updateTask,
        deleteTask,
        reorderTasks
      }}
    >
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TasksContext)
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider')
  }
  return context
} 