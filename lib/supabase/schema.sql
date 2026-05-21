-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Boards table
CREATE TABLE public.boards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_private BOOLEAN DEFAULT false,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pins table
CREATE TABLE public.pins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  image_width INTEGER,
  image_height INTEGER,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Board pins (many-to-many relationship)
CREATE TABLE public.board_pins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE NOT NULL,
  pin_id UUID REFERENCES public.pins(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(board_id, pin_id)
);

-- Indexes for performance
CREATE INDEX idx_boards_user_id ON public.boards(user_id);
CREATE INDEX idx_pins_user_id ON public.pins(user_id);
CREATE INDEX idx_board_pins_board_id ON public.board_pins(board_id);
CREATE INDEX idx_board_pins_pin_id ON public.board_pins(pin_id);
CREATE INDEX idx_pins_created_at ON public.pins(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_pins ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Boards policies
CREATE POLICY "Public boards are viewable by everyone"
  ON public.boards FOR SELECT
  USING (is_private = false OR user_id = auth.uid());

CREATE POLICY "Users can create own boards"
  ON public.boards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own boards"
  ON public.boards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own boards"
  ON public.boards FOR DELETE
  USING (auth.uid() = user_id);

-- Pins policies
CREATE POLICY "Pins are viewable by everyone"
  ON public.pins FOR SELECT
  USING (true);

CREATE POLICY "Users can create pins"
  ON public.pins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pins"
  ON public.pins FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pins"
  ON public.pins FOR DELETE
  USING (auth.uid() = user_id);

-- Board pins policies
CREATE POLICY "Board pins are viewable by everyone"
  ON public.board_pins FOR SELECT
  USING (true);

CREATE POLICY "Users can add pins to own boards"
  ON public.board_pins FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE id = board_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove pins from own boards"
  ON public.board_pins FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.boards
      WHERE id = board_id AND user_id = auth.uid()
    )
  );

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
