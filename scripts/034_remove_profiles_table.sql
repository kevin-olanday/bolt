-- Remove profiles table and all references to eliminate RLS infinite recursion
-- Since we're using SSO, we don't need user profiles stored in the database

-- Drop all policies that reference profiles table
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON profiles;
DROP POLICY IF EXISTS "profiles_service_role_access" ON profiles;
DROP POLICY IF EXISTS "profiles_service_role_bypass" ON profiles;

-- Drop any triggers that reference profiles
DROP TRIGGER IF EXISTS update_jwt_claims_trigger ON profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop functions that reference profiles
DROP FUNCTION IF EXISTS update_user_jwt_claims();
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS auth.get_user_role();

-- Remove foreign key constraint from productivity_entries if it exists
ALTER TABLE productivity_entries DROP CONSTRAINT IF EXISTS productivity_entries_user_id_fkey;

-- Drop the profiles table entirely
DROP TABLE IF EXISTS profiles CASCADE;

-- Verify the table is gone
SELECT 'Profiles table removed successfully' as status;
