-- Add role-based access to modules
-- Assign Sprint Pass to DevOps role only, others to general access

UPDATE modules 
SET visible_to_roles = ARRAY['DevOps'] 
WHERE name = 'sprint_pass';

UPDATE modules 
SET visible_to_roles = ARRAY['Admin', 'Analyst', 'DevOps', 'Team Lead'] 
WHERE name != 'sprint_pass' AND visible_to_roles IS NULL;

-- Verify the updates
SELECT name, title, visible_to_roles FROM modules ORDER BY sort_order;
