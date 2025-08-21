-- Ensure BOSS Academy and Skills Matrix modules exist in database with proper data

-- Insert or update BOSS Academy module
INSERT INTO modules (
  name, 
  title, 
  description, 
  icon, 
  status, 
  sort_order, 
  button_text, 
  button_action,
  created_at,
  updated_at
) VALUES (
  'boss_academy',
  'BOSS Academy',
  'Access comprehensive training modules and skill development resources for BizOps excellence',
  'GraduationCap',
  'coming_soon',
  10,
  'Launch',
  null,
  NOW(),
  NOW()
) ON CONFLICT (name) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  status = EXCLUDED.status,
  button_text = EXCLUDED.button_text,
  updated_at = NOW();

-- Insert or update Skills Matrix module
INSERT INTO modules (
  name, 
  title, 
  description, 
  icon, 
  status, 
  sort_order, 
  button_text, 
  button_action,
  created_at,
  updated_at
) VALUES (
  'skills_matrix',
  'Skills Matrix',
  'Visualize team competencies and identify skill gaps across different domains and technologies',
  'Grid3X3',
  'coming_soon',
  11,
  'Launch',
  null,
  NOW(),
  NOW()
) ON CONFLICT (name) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  status = EXCLUDED.status,
  button_text = EXCLUDED.button_text,
  updated_at = NOW();

-- Verify the modules exist with icons
SELECT name, title, icon, status, sort_order 
FROM modules 
WHERE name IN ('boss_academy', 'skills_matrix')
ORDER BY sort_order;
