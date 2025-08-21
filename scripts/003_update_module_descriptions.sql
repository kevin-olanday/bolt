-- Update module descriptions to be much shorter and more concise
UPDATE public.modules SET description = 'View team contacts' WHERE name = 'team_roster';
UPDATE public.modules SET description = 'Track daily metrics' WHERE name = 'productivity_tracker';
UPDATE public.modules SET description = 'Monitor attendance' WHERE name = 'attendance';
UPDATE public.modules SET description = 'Compare user roles' WHERE name = 'compare_access';
UPDATE public.modules SET description = 'Admin controls' WHERE name = 'admin_view';
UPDATE public.modules SET description = 'Custom analytics' WHERE name = 'dashboards';
UPDATE public.modules SET description = 'Collect feedback' WHERE name = 'feedback_board';
UPDATE public.modules SET description = 'Team messaging' WHERE name = 'chatbox';
