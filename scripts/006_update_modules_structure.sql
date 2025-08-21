-- Update module names and remove admin view
UPDATE modules SET name = 'echoboard', title = 'Echoboard 2.0' WHERE name = 'feedback_board';
DELETE FROM modules WHERE name = 'admin_view';

-- Ensure BizOps App List has proper icon
UPDATE modules SET icon = 'List' WHERE name = 'bizops_app_list';

-- Update sort orders after removing admin view
UPDATE modules SET sort_order = 5 WHERE name = 'bizops_app_list';
UPDATE modules SET sort_order = 6 WHERE name = 'dashboards';
UPDATE modules SET sort_order = 7 WHERE name = 'echoboard';
UPDATE modules SET sort_order = 8 WHERE name = 'chatbox';
