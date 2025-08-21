-- Create quick_links table for storing dashboard links
CREATE TABLE IF NOT EXISTS public.quick_links (
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

-- Enable Row Level Security
ALTER TABLE public.quick_links ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a dashboard tool)
CREATE POLICY "Allow public read access to quick_links" 
  ON public.quick_links FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert to quick_links" 
  ON public.quick_links FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update to quick_links" 
  ON public.quick_links FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public delete from quick_links" 
  ON public.quick_links FOR DELETE 
  USING (true);

-- Insert some default quick links
INSERT INTO public.quick_links (title, url, description, icon, category, sort_order) VALUES
  ('Google Drive', 'https://drive.google.com', 'Access shared documents and files', '📁', 'productivity', 1),
  ('Slack Workspace', 'https://slack.com', 'Team communication and collaboration', '💬', 'communication', 2),
  ('GitHub Repository', 'https://github.com', 'Code repository and version control', '🔧', 'development', 3),
  ('Figma Design', 'https://figma.com', 'Design collaboration and prototyping', '🎨', 'design', 4),
  ('Notion Workspace', 'https://notion.so', 'Documentation and project management', '📝', 'productivity', 5),
  ('Analytics Dashboard', 'https://analytics.google.com', 'Website and app analytics', '📊', 'analytics', 6);
