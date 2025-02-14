import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  isParentMode: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  verifyParentPin: (pin: string) => boolean
  setParentMode: (enabled: boolean) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isParentMode, setIsParentMode] = useState(false)

  // Load parent mode state on startup
  useEffect(() => {
    loadParentMode()
  }, [])

  // Load parent mode from storage
  const loadParentMode = async () => {
    try {
      const value = await AsyncStorage.getItem('isParentMode')
      setIsParentMode(value === 'true')
    } catch (error) {
      console.error('Error loading parent mode:', error)
    }
  }

  // Save parent mode to storage
  const setParentMode = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem('isParentMode', enabled.toString())
      setIsParentMode(enabled)
    } catch (error) {
      console.error('Error saving parent mode:', error)
    }
  }

  // Clear parent mode on sign out
  const signOut = async () => {
    try {
      await setParentMode(false)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      throw error
    }
  }

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

  const verifyParentPin = (pin: string) => {
    return pin === '1234' // Default PIN as specified in docs
  }

  const value = {
    user,
    session,
    loading,
    isParentMode,
    signUp,
    signIn,
    signOut,
    verifyParentPin,
    setParentMode,
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