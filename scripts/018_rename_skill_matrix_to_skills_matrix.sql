-- Update the Skill Matrix module name to Skills Matrix
UPDATE modules 
SET title = 'Skills Matrix'
WHERE name = 'skill_matrix';

-- Verify the update
SELECT name, title, description, status FROM modules WHERE name = 'skill_matrix';
