-- Disable RLS policies that are causing infinite recursion
-- This is a temporary fix for development - in production with proper SSO, 
-- RLS should be re-enabled with correct policies

-- Disable RLS on all tables to prevent infinite recursion
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE productivity_entries DISABLE ROW LEVEL SECURITY;
ALTER TABLE modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE quick_links DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might be causing recursion
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON profiles;

DROP POLICY IF EXISTS "productivity_entries_select_own" ON productivity_entries;
DROP POLICY IF EXISTS "productivity_entries_insert_own" ON productivity_entries;
DROP POLICY IF EXISTS "productivity_entries_update_own" ON productivity_entries;
DROP POLICY IF EXISTS "productivity_entries_delete_own" ON productivity_entries;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'productivity_entries', 'modules', 'quick_links');
