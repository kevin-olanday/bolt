-- Create permissive RLS policy for attendance table (development)
-- This follows the same pattern as productivity_entries table
-- In production with proper SSO, this should be replaced with restrictive policies

-- First, temporarily disable the foreign key constraint to allow placeholder user_id
ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_user_id_fkey;

-- Keep RLS enabled but create a permissive policy
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Drop any existing restrictive policies
DROP POLICY IF EXISTS "Users can view own attendance" ON attendance;
DROP POLICY IF EXISTS "Users can insert own attendance" ON attendance;
DROP POLICY IF EXISTS "Users can update own attendance" ON attendance;
DROP POLICY IF EXISTS "Users can delete own attendance" ON attendance;

-- Create a permissive policy that allows all operations for public role
CREATE POLICY "Allow all operations on attendance" ON attendance
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- Verify the policy is created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'attendance';

-- Verify the foreign key constraint is removed
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name='attendance';
