-- Create quick_links table to store dashboard links
CREATE TABLE IF NOT EXISTS quick_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert some default quick links
INSERT INTO quick_links (title, url, description, icon, category, sort_order) VALUES
('Company Portal', 'https://portal.company.com', 'Access employee resources and benefits', '🏢', 'work', 1),
('Project Management', 'https://asana.com', 'Track tasks and project progress', '📋', 'work', 2),
('Team Calendar', 'https://calendar.google.com', 'View team schedules and meetings', '📅', 'work', 3),
('Documentation', 'https://docs.company.com', 'Internal knowledge base and guides', '📚', 'resources', 4),
('Support Tickets', 'https://support.company.com', 'Submit and track support requests', '🎫', 'support', 5),
('Analytics Dashboard', 'https://analytics.company.com', 'View performance metrics and reports', '📊', 'analytics', 6);
