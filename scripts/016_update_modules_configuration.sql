-- Update module statuses and remove chatbox
-- 1. Disable Team Roster (set to coming_soon)
-- 2. Enable BizOps App List (set to active)
-- 3. Remove Chatbox module
-- 4. Add BOSS Academy module

-- Update Team Roster to coming_soon
UPDATE modules 
SET status = 'coming_soon', updated_at = NOW()
WHERE name = 'team-roster';

-- Update BizOps App List to active
UPDATE modules 
SET status = 'active', updated_at = NOW()
WHERE name = 'bizops-app-list';

-- Remove Chatbox module
DELETE FROM modules WHERE name = 'chatbox';

-- Add BOSS Academy module
INSERT INTO modules (
  id,
  name,
  title,
  description,
  icon,
  status,
  button_text,
  button_action,
  sort_order,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'boss-academy',
  'BOSS Academy',
  'BizOps Skill-up Series',
  'GraduationCap',
  'coming_soon',
  'Launch',
  'navigate',
  10,
  NOW(),
  NOW()
);

-- Verify the changes
SELECT name, title, status, sort_order FROM modules ORDER BY sort_order;
