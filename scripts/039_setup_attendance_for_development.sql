-- Comprehensive setup for attendance table (development)
-- This script creates the table and sets up permissive access for development

-- Drop existing table if it exists (to start fresh)
DROP TABLE IF EXISTS attendance CASCADE;

-- Create attendance table
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL, -- Changed from UUID to TEXT to allow placeholder values
    date DATE NOT NULL,
    attendance_type TEXT NOT NULL CHECK (
        attendance_type IN (
            'In Office',
            'Work From Home (WFH)',
            'Planned Leave',
            'Sick Leave',
            'Emergency Leave',
            'Holiday',
            'Half Day',
            'Volunteer Leave',
            'Off Day'
        )
    ),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON attendance(user_id, date);

-- Create unique constraint to prevent duplicate entries for same user and date
CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_user_date_unique ON attendance(user_id, date);

-- Enable RLS
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Drop any existing restrictive policies
DROP POLICY IF EXISTS "Users can view own attendance" ON attendance;
DROP POLICY IF EXISTS "Users can insert own attendance" ON attendance;
DROP POLICY IF EXISTS "Users can update own attendance" ON attendance;
DROP POLICY IF EXISTS "Users can delete own attendance" ON attendance;

-- Create a permissive policy that allows all operations for public role (development)
CREATE POLICY "Allow all operations on attendance" ON attendance
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_attendance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_attendance_updated_at
    BEFORE UPDATE ON attendance
    FOR EACH ROW
    EXECUTE FUNCTION update_attendance_updated_at();

-- Grant permissions
GRANT ALL ON attendance TO authenticated;
GRANT ALL ON attendance TO anon;

-- Insert some sample data for testing
INSERT INTO attendance (user_id, date, attendance_type, notes) VALUES
    ('00000000-0000-0000-0000-000000000000', CURRENT_DATE, 'In Office', 'Sample entry for today'),
    ('00000000-0000-0000-0000-000000000000', CURRENT_DATE - INTERVAL '1 day', 'Work From Home (WFH)', 'Sample WFH entry'),
    ('00000000-0000-0000-0000-000000000000', CURRENT_DATE - INTERVAL '2 days', 'Planned Leave', 'Sample leave entry');

-- Verify the setup
SELECT 
    schemaname, 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'attendance';

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
WHERE tablename = 'attendance';

-- Show table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'attendance'
ORDER BY ordinal_position;

-- Show sample data
SELECT * FROM attendance ORDER BY date DESC;
