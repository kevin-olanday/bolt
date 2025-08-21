-- Fix RLS infinite recursion by creating simpler policies that don't reference profiles table

-- First, drop all existing policies that might be causing recursion
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own entries" ON productivity_entries;
DROP POLICY IF EXISTS "Admins can view all entries" ON productivity_entries;
DROP POLICY IF EXISTS "Team leads can view all entries" ON productivity_entries;

-- Disable RLS temporarily to avoid issues
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE productivity_entries DISABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view and update their own profile using auth.uid()
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create simple policies for productivity_entries table
ALTER TABLE productivity_entries ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own entries
CREATE POLICY "productivity_entries_select_own" ON productivity_entries
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own entries
CREATE POLICY "productivity_entries_insert_own" ON productivity_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own entries
CREATE POLICY "productivity_entries_update_own" ON productivity_entries
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own entries
CREATE POLICY "productivity_entries_delete_own" ON productivity_entries
  FOR DELETE USING (auth.uid() = user_id);

-- For development/testing purposes, create a bypass policy for service role
-- This allows the application to work without authentication during development
CREATE POLICY "productivity_entries_service_role_bypass" ON productivity_entries
  FOR ALL USING (current_setting('role') = 'service_role');

CREATE POLICY "profiles_service_role_bypass" ON profiles
  FOR ALL USING (current_setting('role') = 'service_role');

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('profiles', 'productivity_entries')
ORDER BY tablename, policyname;
