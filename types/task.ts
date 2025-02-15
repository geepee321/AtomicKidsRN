export type Task = {
  id: string
  title: string
  child_id: string | null
  completed: boolean
  completed_at: string | null
  created_at: string
  user_id: string
  order: number
} 