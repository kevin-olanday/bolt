-- Drop existing table if it exists and recreate with new schema
DROP TABLE IF EXISTS public.productivity_entries;

-- Create productivity_entries table with time_worked field instead of start_time/end_time
CREATE TABLE public.productivity_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    time_worked INTEGER NOT NULL, -- Time worked in minutes
    work_mode TEXT NOT NULL CHECK (work_mode IN ('Focus', 'Collaboration', 'Learning', 'Admin', 'Break')),
    task_description TEXT NOT NULL,
    project TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_productivity_entries_date ON public.productivity_entries(date);
CREATE INDEX idx_productivity_entries_work_mode ON public.productivity_entries(work_mode);
CREATE INDEX idx_productivity_entries_project ON public.productivity_entries(project);

-- Enable Row Level Security
ALTER TABLE public.productivity_entries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on productivity_entries" ON public.productivity_entries
    FOR ALL USING (true);

-- Insert comprehensive dummy data for testing daily, weekly, monthly views
INSERT INTO public.productivity_entries (date, time_worked, work_mode, task_description, project, notes) VALUES
    -- Today's entries
    (CURRENT_DATE, 90, 'Focus', 'Code review and bug fixes', 'The BASE Dashboard', 'Fixed responsive layout issues'),
    (CURRENT_DATE, 75, 'Collaboration', 'Team standup and planning', 'Sprint Planning', 'Discussed Q1 priorities'),
    (CURRENT_DATE, 90, 'Learning', 'React performance optimization', 'Professional Development', 'Studied React.memo and useMemo'),
    (CURRENT_DATE, 45, 'Admin', 'Email and administrative tasks', 'Management', 'Processed team requests'),
    
    -- Yesterday's entries
    (CURRENT_DATE - 1, 90, 'Focus', 'Database schema design', 'User Management', 'Designed user roles table'),
    (CURRENT_DATE - 1, 75, 'Admin', 'Weekly reports preparation', 'Management', 'Compiled team metrics'),
    (CURRENT_DATE - 1, 120, 'Focus', 'Feature development', 'The BASE Dashboard', 'Implemented dark mode toggle'),
    (CURRENT_DATE - 1, 30, 'Break', 'Team coffee break', 'Social', 'Discussed weekend plans'),
    
    -- 2 days ago
    (CURRENT_DATE - 2, 90, 'Focus', 'API endpoint development', 'Integration Project', 'Built authentication middleware'),
    (CURRENT_DATE - 2, 60, 'Collaboration', 'Client meeting', 'Project Alpha', 'Requirements gathering session'),
    (CURRENT_DATE - 2, 45, 'Learning', 'TypeScript advanced patterns', 'Professional Development', 'Generic constraints and mapped types'),
    
    -- 3 days ago
    (CURRENT_DATE - 3, 120, 'Focus', 'Frontend component refactoring', 'The BASE Dashboard', 'Modularized dashboard cards'),
    (CURRENT_DATE - 3, 90, 'Collaboration', 'Code review session', 'Team Activity', 'Reviewed 3 pull requests'),
    (CURRENT_DATE - 3, 30, 'Admin', 'Sprint retrospective', 'Management', 'Action items documented'),
    
    -- Last week entries (7-10 days ago)
    (CURRENT_DATE - 7, 105, 'Focus', 'Database optimization', 'Performance Project', 'Optimized query performance'),
    (CURRENT_DATE - 7, 60, 'Learning', 'PostgreSQL indexing strategies', 'Professional Development', 'B-tree vs GIN indexes'),
    (CURRENT_DATE - 8, 90, 'Focus', 'UI/UX improvements', 'The BASE Dashboard', 'Enhanced user experience'),
    (CURRENT_DATE - 8, 75, 'Collaboration', 'Design review meeting', 'Project Beta', 'Approved mockups'),
    (CURRENT_DATE - 9, 120, 'Focus', 'Integration testing', 'Quality Assurance', 'End-to-end test suite'),
    (CURRENT_DATE - 10, 90, 'Admin', 'Team planning session', 'Management', 'Q2 roadmap discussion'),
    
    -- Earlier this month (15-20 days ago)
    (CURRENT_DATE - 15, 90, 'Focus', 'Security audit implementation', 'Security Project', 'Added input validation'),
    (CURRENT_DATE - 15, 60, 'Collaboration', 'Architecture discussion', 'Technical Planning', 'Microservices strategy'),
    (CURRENT_DATE - 16, 105, 'Learning', 'Cloud deployment strategies', 'Professional Development', 'Docker and Kubernetes'),
    (CURRENT_DATE - 17, 90, 'Focus', 'Performance monitoring setup', 'Infrastructure', 'Application metrics dashboard'),
    (CURRENT_DATE - 18, 75, 'Admin', 'Documentation updates', 'Knowledge Management', 'API documentation refresh'),
    (CURRENT_DATE - 20, 120, 'Focus', 'Feature specification', 'Project Gamma', 'Technical requirements document'),
    
    -- Last month entries (25-35 days ago)
    (CURRENT_DATE - 25, 90, 'Focus', 'Legacy code refactoring', 'Maintenance', 'Improved code maintainability'),
    (CURRENT_DATE - 28, 105, 'Collaboration', 'Cross-team integration', 'Project Delta', 'API contract negotiation'),
    (CURRENT_DATE - 30, 75, 'Learning', 'Advanced React patterns', 'Professional Development', 'Custom hooks and context'),
    (CURRENT_DATE - 32, 90, 'Focus', 'Bug investigation and fixes', 'Quality Assurance', 'Resolved critical issues'),
    (CURRENT_DATE - 35, 60, 'Admin', 'Monthly team review', 'Management', 'Performance evaluations');
