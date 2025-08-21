-- Create productivity_entries table for tracking daily work activities
CREATE TABLE IF NOT EXISTS public.productivity_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    work_mode TEXT NOT NULL CHECK (work_mode IN ('Focus', 'Collaboration', 'Learning', 'Admin', 'Break')),
    task_description TEXT NOT NULL,
    project TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_productivity_entries_date ON public.productivity_entries(date);
CREATE INDEX IF NOT EXISTS idx_productivity_entries_work_mode ON public.productivity_entries(work_mode);
CREATE INDEX IF NOT EXISTS idx_productivity_entries_project ON public.productivity_entries(project);

-- Enable Row Level Security
ALTER TABLE public.productivity_entries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust based on your auth requirements)
CREATE POLICY IF NOT EXISTS "Allow all operations on productivity_entries" ON public.productivity_entries
    FOR ALL USING (true);

-- Insert sample data
INSERT INTO public.productivity_entries (date, start_time, end_time, work_mode, task_description, project, notes) VALUES
    (CURRENT_DATE, '09:00', '10:30', 'Focus', 'Code review and bug fixes', 'BOLT Dashboard', 'Fixed responsive layout issues'),
    (CURRENT_DATE, '10:45', '12:00', 'Collaboration', 'Team standup and planning', 'Sprint Planning', 'Discussed Q1 priorities'),
    (CURRENT_DATE, '13:00', '14:30', 'Learning', 'React performance optimization', 'Professional Development', 'Studied React.memo and useMemo'),
    (CURRENT_DATE - 1, '09:30', '11:00', 'Focus', 'Database schema design', 'User Management', 'Designed user roles table'),
    (CURRENT_DATE - 1, '11:15', '12:30', 'Admin', 'Weekly reports preparation', 'Management', 'Compiled team metrics'),
    (CURRENT_DATE - 2, '10:00', '11:30', 'Focus', 'API endpoint development', 'Integration Project', 'Built authentication middleware');
