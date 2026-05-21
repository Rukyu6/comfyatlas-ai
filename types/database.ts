export type Profile = {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export type Board = {
  id: string
  user_id: string
  title: string
  description: string | null
  is_private: boolean
  cover_image_url: string | null
  created_at: string
  updated_at: string
}

export type Pin = {
  id: string
  user_id: string
  title: string
  description: string | null
  image_url: string
  image_width: number | null
  image_height: number | null
  source_url: string | null
  created_at: string
}

export type BoardPin = {
  id: string
  board_id: string
  pin_id: string
  created_at: string
}
