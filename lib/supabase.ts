import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vnjmvbpumqsqdyehruvl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuam12YnB1bXFzcWR5ZWhydXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MTkxNzIsImV4cCI6MjA1NTA5NTE3Mn0.SY_DRNCmTQHkuVlPBQemSffx4lG76ZQT2MKZ21mzfIw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}) 