-- Update module names and descriptions, add Skill Matrix module

-- Update Compare Access to Access Compare
UPDATE modules 
SET 
  title = 'Access Compare',
  description = 'Compare user permissions and access levels across multiple systems and applications'
WHERE name = 'compare_access';

-- Update BOSS Academy with proper details
UPDATE modules 
SET 
  title = 'BOSS Academy',
  description = 'Access comprehensive training modules and skill development resources for BizOps excellence'
WHERE name = 'boss_academy';

-- Update Productivity Tracker description
UPDATE modules 
SET 
  description = 'Monitor daily work activities, track time allocation, and analyze productivity patterns across projects'
WHERE name = 'productivity_tracker';

-- Update Team Roster description
UPDATE modules 
SET 
  description = 'Access comprehensive team directory with contact information, roles, and organizational structure'
WHERE name = 'team_roster';

-- Add Skill Matrix module
INSERT INTO modules (name, title, description, icon, status, sort_order, created_at, updated_at)
VALUES (
  'skill_matrix',
  'Skill Matrix',
  'Visualize team competencies and identify skill gaps across different domains and technologies',
  'Grid3X3',
  'coming_soon',
  11,
  NOW(),
  NOW()
)
ON CONFLICT (name) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  updated_at = NOW();

-- Verify the updates
SELECT name, title, description, status FROM modules ORDER BY sort_order;
