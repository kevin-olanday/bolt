-- Create attendance table if it doesn't exist
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Create unique constraint to prevent duplicate entries for the same user on the same date
CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_user_date_unique ON attendance(user_id, date);

-- Enable Row Level Security
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own attendance records
CREATE POLICY "Users can view own attendance" ON attendance
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own attendance records
CREATE POLICY "Users can insert own attendance" ON attendance
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own attendance records
CREATE POLICY "Users can update own attendance" ON attendance
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own attendance records
CREATE POLICY "Users can delete own attendance" ON attendance
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_attendance_updated_at 
    BEFORE UPDATE ON attendance 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON attendance TO authenticated;
GRANT USAGE ON SEQUENCE attendance_id_seq TO authenticated;

-- Insert some sample data for testing (optional)
-- INSERT INTO attendance (user_id, date, attendance_type, notes) VALUES
--     ('00000000-0000-0000-0000-000000000000', CURRENT_DATE, 'In Office', 'Sample entry'),
--     ('00000000-0000-0000-0000-000000000000', CURRENT_DATE - INTERVAL '1 day', 'Work From Home (WFH)', 'Remote work day');

COMMENT ON TABLE attendance IS 'Stores user attendance records with various attendance types';
COMMENT ON COLUMN attendance.attendance_type IS 'Type of attendance: In Office, WFH, Leave types, etc.';
COMMENT ON COLUMN attendance.notes IS 'Optional notes about the attendance entry';
