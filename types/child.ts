export interface Child {
  id: string
  user_id: string
  name: string
  created_at: string
  updated_at: string
}

export interface CreateChildInput {
  name: string
}

export interface UpdateChildInput {
  name?: string
} 