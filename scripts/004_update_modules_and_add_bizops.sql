-- Update Feedback Board to Echoboard 2.0 and add BizOps App List module
UPDATE modules 
SET title = 'Echoboard 2.0', 
    description = 'Enhanced feedback system'
WHERE name = 'feedback_board';

INSERT INTO modules (
  name, title, description, icon, status, sort_order, button_text, button_action
) VALUES (
  'bizops_app_list', 'BizOps App List', 'Directory of business apps', 'List', 'coming_soon', 9, null, null
);
