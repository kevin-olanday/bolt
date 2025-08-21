-- Replace all existing quick links with the 8 specified tools
-- Clear existing quick links
DELETE FROM quick_links;

-- Insert the 8 new quick links with appropriate icons and categories
INSERT INTO quick_links (title, description, url, icon, category, is_active, sort_order) VALUES
('TheHub', 'Central hub for all operations', '#', 'Globe', 'Operations', true, 1),
('Sailpoint IIQ', 'Identity and access management', '#', 'Shield', 'Security', true, 2),
('Helix', 'IT service management platform', '#', 'Wrench', 'IT Services', true, 3),
('BizOps Sharepoint', 'Business operations document hub', '#', 'Share2', 'Collaboration', true, 4),
('BizOps Confluence', 'Team collaboration and documentation', '#', 'BookOpen', 'Collaboration', true, 5),
('BizOps JIRA', 'Project tracking and issue management', '#', 'Bug', 'Project Management', true, 6),
('Poseidon JIRA', 'Poseidon project management', '#', 'Trident', 'Project Management', true, 7),
('AOMR', 'Analytics and operational metrics reporting', '#', 'BarChart3', 'Analytics', true, 8);
