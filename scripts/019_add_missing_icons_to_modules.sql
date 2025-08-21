-- Add missing icons to BOSS Academy and Skills Matrix modules
UPDATE modules 
SET icon = 'GraduationCap'
WHERE name = 'boss_academy';

UPDATE modules 
SET icon = 'Grid3X3'
WHERE name = 'skill_matrix';

-- Verify the updates
SELECT name, title, icon, status FROM modules 
WHERE name IN ('boss_academy', 'skill_matrix')
ORDER BY name;
