-- Fix RLS infinite recursion by using JWT claims instead of table lookups
-- This approach stores user role in JWT metadata to avoid circular policy dependencies

-- First, disable existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own entries" ON productivity_entries;
DROP POLICY IF EXISTS "Admins and leads can view all entries" ON productivity_entries;

-- Create a function to get user role from JWT claims (bypasses RLS)
CREATE OR REPLACE FUNCTION auth.get_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    auth.jwt() ->> 'user_role',
    'Analyst'  -- Default role if not set
  );
$$;

-- Create simple RLS policies using JWT claims instead of table lookups
CREATE POLICY "Enable read access for own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable update access for own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- For productivity entries, use role from JWT claims
CREATE POLICY "Users can view own entries or admins/leads can view all" ON productivity_entries
  FOR SELECT USING (
    user_id = auth.uid() OR 
    auth.get_user_role() IN ('Admin', 'Team Lead')
  );

CREATE POLICY "Users can insert own entries" ON productivity_entries
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own entries" ON productivity_entries
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own entries" ON productivity_entries
  FOR DELETE USING (user_id = auth.uid());

-- Create a trigger to update JWT metadata when profile role changes
CREATE OR REPLACE FUNCTION update_user_jwt_claims()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the user's JWT metadata with their role
  UPDATE auth.users 
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object('user_role', NEW.role)
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update JWT claims when role changes
DROP TRIGGER IF EXISTS update_jwt_claims_trigger ON profiles;
CREATE TRIGGER update_jwt_claims_trigger
  AFTER INSERT OR UPDATE OF role ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_jwt_claims();

-- Update existing users' JWT metadata with their current roles
UPDATE auth.users 
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || 
  jsonb_build_object('user_role', p.role)
FROM profiles p 
WHERE auth.users.id = p.id;

-- Verify the setup
SELECT 'RLS policies updated successfully' as status;
