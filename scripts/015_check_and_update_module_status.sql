-- Check current module status
SELECT name, status FROM modules WHERE name IN ('Team Roster', 'Productivity Tracker');

-- Update Productivity Tracker to active status to match Team Roster styling
UPDATE modules 
SET status = 'active', updated_at = NOW()
WHERE name = 'Productivity Tracker' AND status != 'active';

-- Verify the update
SELECT name, status FROM modules WHERE name IN ('Team Roster', 'Productivity Tracker');
