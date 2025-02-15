import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './auth'

export interface Child {
  id: string
  name: string
  parent_id: string
  streak: number
  selected_character_id: string | null
  created_at: string
  updated_at: string
  last_completed_at: string | null
  order: number
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
  reorderChildren: (children: Child[]) => Promise<void>
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
        .order('order', { ascending: true })

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
      const maxOrder = Math.max(...children.map(c => c.order), -1) + 1
      const { data, error: insertError } = await supabase
        .from('children')
        .insert([{ 
          name, 
          user_id: user?.id,
          avatar_id: '1', // Default avatar
          order: maxOrder
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

      // If streak increased, check for and unlock new rewards
      if (increment) {
        const { data: rewards, error: rewardsError } = await supabase
          .from('rewards')
          .select('*')
          .lte('streak_requirement', newStreak)
          .order('streak_requirement', { ascending: true });

        if (rewardsError) throw rewardsError;

        // For each eligible reward, try to unlock it
        for (const reward of rewards) {
          const { error: unlockError } = await supabase
            .from('child_rewards')
            .upsert(
              { 
                child_id: id, 
                reward_id: reward.id,
                unlocked_at: now 
              },
              { 
                onConflict: 'child_id,reward_id',
                ignoreDuplicates: true 
              }
            );

          if (unlockError) throw unlockError;
        }
      }

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

  const reorderChildren = async (reorderedChildren: Child[]) => {
    try {
      setError(null)
      if (!user?.id) return;
      
      // First assign temporary high orders to avoid conflicts
      const tempUpdates = reorderedChildren.map((child, index) => ({
        id: child.id,
        order: 1000000 + index // Use high temporary values
      }))

      console.log('Setting temporary orders:', tempUpdates)
      const { error: tempError } = await supabase
        .from('children')
        .update({ order: tempUpdates[0].order })
        .eq('id', tempUpdates[0].id)

      if (tempError) {
        console.error('Error setting temporary orders:', tempError)
        throw tempError
      }

      // Update remaining children one by one to avoid conflicts
      for (let i = 1; i < tempUpdates.length; i++) {
        const { error } = await supabase
          .from('children')
          .update({ order: tempUpdates[i].order })
          .eq('id', tempUpdates[i].id)
        
        if (error) {
          console.error(`Error setting temporary order for child ${i}:`, error)
          throw error
        }
      }

      // Then set the final orders one by one
      for (let i = 0; i < reorderedChildren.length; i++) {
        const { error } = await supabase
          .from('children')
          .update({ order: i })
          .eq('id', reorderedChildren[i].id)
        
        if (error) {
          console.error(`Error setting final order for child ${i}:`, error)
          throw error
        }
      }

      console.log('Order updated successfully')
      setChildren(reorderedChildren)
    } catch (err) {
      console.error('Error in reorderChildren:', err)
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
        updateStreak,
        reorderChildren
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