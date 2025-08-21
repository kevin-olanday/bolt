-- Create modules table to manage dashboard module availability and status
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'coming_soon' CHECK (status IN ('active', 'coming_soon', 'maintenance', 'disabled')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  button_text TEXT,
  button_action TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for security
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no auth required for dashboard viewing)
CREATE POLICY "modules_select_all" ON public.modules FOR SELECT USING (true);

-- Insert initial module data
INSERT INTO public.modules (name, title, description, icon, status, sort_order, button_text, button_action) VALUES
  ('team_roster', 'Team Roster', 'View team contacts', 'Users', 'active', 1, 'Open Roster', '/team'),
  ('productivity_tracker', 'Productivity Tracker', 'Track daily metrics', 'BarChart3', 'coming_soon', 2, null, null),
  ('attendance', 'Attendance', 'Monitor attendance', 'Calendar', 'coming_soon', 3, null, null),
  ('compare_access', 'Compare Access', 'Compare permissions', 'Shield', 'coming_soon', 4, null, null),
  ('admin_view', 'Admin View', 'Admin controls', 'Settings', 'coming_soon', 5, null, null),
  ('dashboards', 'Dashboards', 'Custom analytics', 'LineChart', 'coming_soon', 6, null, null),
  ('feedback_board', 'Feedback Board', 'Team feedback', 'MessageSquare', 'coming_soon', 7, null, null),
  ('chatbox', 'Chatbox', 'Team chat', 'MessageCircle', 'coming_soon', 8, null, null);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON public.modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
