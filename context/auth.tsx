import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  verifyParentPin: (pin: string) => Promise<boolean>
  setParentPin: (pin: string) => Promise<void>
  getParentPin: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      throw error
    }
  }

  const getParentPin = async () => {
    if (!user) {
      return null
    }
    const { data, error } = await supabase
      .from('parent_pins')
      .select('pin')
      .eq('user_id', user.id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw error
    }
    return data?.pin || null
  }

  const setParentPin = async (pin: string) => {
    if (!user) throw new Error('No user logged in')
    
    // Use upsert to handle both insert and update cases
    const { error } = await supabase
      .from('parent_pins')
      .upsert({ 
        user_id: user.id,
        pin: pin 
      })
    
    if (error) {
      throw error
    }
  }

  const verifyParentPin = async (pin: string) => {
    if (!user) {
      return false
    }
    const storedPin = await getParentPin()
    return storedPin === pin
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    verifyParentPin,
    setParentPin,
    getParentPin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}