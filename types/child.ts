export interface Child {
  id: string
  user_id: string
  name: string
  avatar_id: string
  created_at: string
  updated_at: string
}

export interface CreateChildInput {
  name: string
  avatar_id: string
}

export interface UpdateChildInput {
  name?: string
  avatar_id?: string
} 