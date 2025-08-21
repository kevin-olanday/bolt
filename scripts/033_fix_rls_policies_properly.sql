-- Fix RLS infinite recursion by implementing proper policies
-- Based on Supabase best practices to avoid circular dependencies

-- First, drop all existing policies that might be causing recursion
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON profiles;

DROP POLICY IF EXISTS "productivity_entries_select_policy" ON productivity_entries;
DROP POLICY IF EXISTS "productivity_entries_insert_policy" ON productivity_entries;
DROP POLICY IF EXISTS "productivity_entries_update_policy" ON productivity_entries;
DROP POLICY IF EXISTS "productivity_entries_delete_policy" ON productivity_entries;

-- Re-enable RLS on tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE productivity_entries ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies for profiles table
-- These use direct auth.uid() comparisons without subqueries
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Create simple policies for productivity_entries table
-- These reference the user_id column directly without joining to profiles
CREATE POLICY "productivity_entries_select_own" ON productivity_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "productivity_entries_insert_own" ON productivity_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "productivity_entries_update_own" ON productivity_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "productivity_entries_delete_own" ON productivity_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Add service role bypass policies for development/admin access
-- These allow the service role to access all data
CREATE POLICY "profiles_service_role_access" ON profiles
  FOR ALL USING (current_setting('role') = 'service_role');

CREATE POLICY "productivity_entries_service_role_access" ON productivity_entries
  FOR ALL USING (current_setting('role') = 'service_role');

-- Verify the policies were created successfully
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('profiles', 'productivity_entries')
ORDER BY tablename, policyname;
