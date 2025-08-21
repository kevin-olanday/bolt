-- Create productivity entries table for tracking daily work activity
CREATE TABLE IF NOT EXISTS productivity_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  work_mode VARCHAR(10) NOT NULL CHECK (work_mode IN ('WFH', 'WFO', 'Leave')),
  activity_type VARCHAR(100) NOT NULL,
  ticket_id VARCHAR(50),
  details TEXT NOT NULL,
  duration_hours INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_productivity_entries_user_date ON productivity_entries(user_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_productivity_entries_work_mode ON productivity_entries(work_mode);
CREATE INDEX IF NOT EXISTS idx_productivity_entries_activity_type ON productivity_entries(activity_type);

-- Enable RLS
ALTER TABLE productivity_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own productivity entries" ON productivity_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own productivity entries" ON productivity_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own productivity entries" ON productivity_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own productivity entries" ON productivity_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Insert sample data
INSERT INTO productivity_entries (user_id, entry_date, work_mode, activity_type, ticket_id, details, duration_hours, duration_minutes, notes) VALUES
  (gen_random_uuid(), CURRENT_DATE, 'WFH', 'Development', 'BOLT-123', 'Implemented user authentication system', 4, 30, 'Completed ahead of schedule'),
  (gen_random_uuid(), CURRENT_DATE, 'WFO', 'Meeting', NULL, 'Sprint planning and retrospective', 2, 0, 'Good team alignment'),
  (gen_random_uuid(), CURRENT_DATE - 1, 'WFH', 'Bug Fix', 'BOLT-124', 'Fixed login redirect issue', 1, 45, 'Required database migration'),
  (gen_random_uuid(), CURRENT_DATE - 1, 'Leave', 'Sick Leave', NULL, 'Personal health day', 8, 0, 'Doctor appointment');
