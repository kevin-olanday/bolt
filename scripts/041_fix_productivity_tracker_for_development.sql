-- Fix productivity tracker for development
-- This script adds the missing user_id field and sets up permissive access

-- First, drop ALL existing policies that might depend on user_id column
DROP POLICY IF EXISTS "Allow all operations on productivity_entries" ON public.productivity_entries;
DROP POLICY IF EXISTS "Users can view own productivity entries" ON public.productivity_entries;
DROP POLICY IF EXISTS "Users can insert own productivity entries" ON public.productivity_entries;
DROP POLICY IF EXISTS "Users can update own productivity entries" ON public.productivity_entries;
DROP POLICY IF EXISTS "Users can delete own productivity entries" ON public.productivity_entries;
DROP POLICY IF EXISTS "productivity_entries_select_own" ON public.productivity_entries;
DROP POLICY IF EXISTS "productivity_entries_insert_own" ON public.productivity_entries;
DROP POLICY IF EXISTS "productivity_entries_update_own" ON public.productivity_entries;
DROP POLICY IF EXISTS "productivity_entries_delete_own" ON public.productivity_entries;

-- Now check if user_id column exists and what type it is
DO $$ 
DECLARE
    col_type text;
BEGIN
    SELECT data_type INTO col_type 
    FROM information_schema.columns 
    WHERE table_name = 'productivity_entries' 
    AND column_name = 'user_id';
    
    -- If column doesn't exist, add it as TEXT
    IF col_type IS NULL THEN
        ALTER TABLE public.productivity_entries ADD COLUMN user_id TEXT NOT NULL DEFAULT 'dev-user-001';
    -- If column exists but is UUID, convert it to TEXT
    ELSIF col_type = 'uuid' THEN
        -- First drop any foreign key constraints
        ALTER TABLE public.productivity_entries DROP CONSTRAINT IF EXISTS productivity_entries_user_id_fkey;
        
        -- Convert UUID column to TEXT
        ALTER TABLE public.productivity_entries ALTER COLUMN user_id TYPE TEXT USING user_id::text;
        
        -- Set default value for existing rows
        UPDATE public.productivity_entries SET user_id = 'dev-user-001' WHERE user_id IS NULL;
    END IF;
END $$;

-- Create index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_productivity_entries_user_id ON public.productivity_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_productivity_entries_user_date ON public.productivity_entries(user_id, date);

-- Create a permissive policy that allows all operations for public role (development)
CREATE POLICY "Allow all operations on productivity_entries" ON public.productivity_entries
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.productivity_entries TO authenticated;
GRANT ALL ON public.productivity_entries TO anon;

-- Update existing entries to have a user_id if they don't have one
UPDATE public.productivity_entries 
SET user_id = 'dev-user-001' 
WHERE user_id IS NULL;

-- Verify the setup
SELECT 
    schemaname, 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'productivity_entries';

-- Verify the policy is created
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check
FROM pg_policies 
WHERE tablename = 'productivity_entries';

-- Show table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'productivity_entries'
ORDER BY ordinal_position;

-- Show sample data
SELECT * FROM public.productivity_entries ORDER BY date DESC LIMIT 5;
