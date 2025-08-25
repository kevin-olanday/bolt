-- Drop existing table if it exists and recreate with new schema
DROP TABLE IF EXISTS public.productivity_entries;

-- Create productivity_entries table with new Activity field structure
CREATE TABLE public.productivity_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    activity TEXT NOT NULL CHECK (activity IN ('Project', 'Request', 'Incident', 'Change', 'Meeting', 'Triage', 'Collaboration', 'Training', 'Admin')),
    ticket TEXT, -- Optional ticket field
    details TEXT NOT NULL,
    time_worked INTEGER NOT NULL, -- Time worked in minutes (Duration)
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_productivity_entries_date ON public.productivity_entries(date);
CREATE INDEX idx_productivity_entries_activity ON public.productivity_entries(activity);
CREATE INDEX idx_productivity_entries_ticket ON public.productivity_entries(ticket);

-- Enable Row Level Security
ALTER TABLE public.productivity_entries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on productivity_entries" ON public.productivity_entries
    FOR ALL USING (true);

-- Insert comprehensive dummy data for testing daily, weekly, monthly views
INSERT INTO public.productivity_entries (date, activity, ticket, details, time_worked, notes) VALUES
    -- Today's entries
    (CURRENT_DATE, 'Project', 'BASE-123', 'Code review and bug fixes for dashboard', 90, 'Fixed responsive layout issues'),
    (CURRENT_DATE, 'Meeting', NULL, 'Team standup and sprint planning', 75, 'Discussed Q1 priorities'),
    (CURRENT_DATE, 'Training', NULL, 'React performance optimization study', 90, 'Studied React.memo and useMemo'),
    (CURRENT_DATE, 'Admin', NULL, 'Email and administrative tasks', 45, 'Processed team requests'),
    
    -- Yesterday's entries
    (CURRENT_DATE - 1, 'Project', 'USER-456', 'Database schema design for user management', 90, 'Designed user roles table'),
    (CURRENT_DATE - 1, 'Admin', NULL, 'Weekly reports preparation', 75, 'Compiled team metrics'),
    (CURRENT_DATE - 1, 'Project', 'BASE-124', 'Dark mode toggle implementation', 120, 'Implemented theme switching'),
    (CURRENT_DATE - 1, 'Collaboration', NULL, 'Team coffee break and informal discussion', 30, 'Discussed weekend plans'),
    
    -- 2 days ago
    (CURRENT_DATE - 2, 'Project', 'INT-789', 'API endpoint development', 90, 'Built authentication middleware'),
    (CURRENT_DATE - 2, 'Meeting', NULL, 'Client requirements gathering session', 60, 'Documented feature requests'),
    (CURRENT_DATE - 2, 'Training', NULL, 'TypeScript advanced patterns', 45, 'Generic constraints and mapped types'),
    
    -- 3 days ago
    (CURRENT_DATE - 3, 'Project', 'BASE-125', 'Frontend component refactoring', 120, 'Modularized dashboard cards'),
    (CURRENT_DATE - 3, 'Collaboration', NULL, 'Code review session with team', 90, 'Reviewed 3 pull requests'),
    (CURRENT_DATE - 3, 'Admin', NULL, 'Sprint retrospective meeting', 30, 'Action items documented'),
    
    -- Last week entries (7-10 days ago)
    (CURRENT_DATE - 7, 'Project', 'PERF-101', 'Database optimization work', 105, 'Optimized query performance'),
    (CURRENT_DATE - 7, 'Training', NULL, 'PostgreSQL indexing strategies', 60, 'B-tree vs GIN indexes'),
    (CURRENT_DATE - 8, 'Project', 'BASE-126', 'UI/UX improvements implementation', 90, 'Enhanced user experience'),
    (CURRENT_DATE - 8, 'Meeting', NULL, 'Design review meeting', 75, 'Approved mockups'),
    (CURRENT_DATE - 9, 'Project', 'QA-202', 'Integration testing setup', 120, 'End-to-end test suite'),
    (CURRENT_DATE - 10, 'Admin', NULL, 'Team planning session', 90, 'Q2 roadmap discussion'),
    
    -- Earlier this month (15-20 days ago)
    (CURRENT_DATE - 15, 'Project', 'SEC-303', 'Security audit implementation', 90, 'Added input validation'),
    (CURRENT_DATE - 15, 'Collaboration', NULL, 'Architecture discussion', 60, 'Microservices strategy'),
    (CURRENT_DATE - 16, 'Training', NULL, 'Cloud deployment strategies', 105, 'Docker and Kubernetes'),
    (CURRENT_DATE - 17, 'Project', 'INF-404', 'Performance monitoring setup', 90, 'Application metrics dashboard'),
    (CURRENT_DATE - 18, 'Admin', NULL, 'Documentation updates', 75, 'API documentation refresh'),
    (CURRENT_DATE - 20, 'Project', 'GAMMA-505', 'Feature specification document', 120, 'Technical requirements document'),
    
    -- Incident and Change examples
    (CURRENT_DATE - 22, 'Incident', 'INC-001', 'Production database connection issue', 180, 'Resolved connection pool exhaustion'),
    (CURRENT_DATE - 24, 'Change', 'CHG-002', 'Server maintenance window', 120, 'Applied security patches'),
    (CURRENT_DATE - 26, 'Request', 'REQ-003', 'User access permission update', 45, 'Updated role assignments'),
    (CURRENT_DATE - 28, 'Triage', 'TRI-004', 'Bug report investigation', 90, 'Categorized and prioritized issues'),
    
    -- Last month entries (25-35 days ago)
    (CURRENT_DATE - 25, 'Project', 'MAINT-606', 'Legacy code refactoring', 90, 'Improved code maintainability'),
    (CURRENT_DATE - 28, 'Collaboration', NULL, 'Cross-team integration meeting', 105, 'API contract negotiation'),
    (CURRENT_DATE - 30, 'Training', NULL, 'Advanced React patterns workshop', 75, 'Custom hooks and context'),
    (CURRENT_DATE - 32, 'Incident', 'INC-005', 'Critical bug investigation', 90, 'Resolved data corruption issue'),
    (CURRENT_DATE - 35, 'Admin', NULL, 'Monthly team review', 60, 'Performance evaluations');
