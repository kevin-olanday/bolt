-- Update productivity tracker status to active to match Team Roster styling
UPDATE modules 
SET status = 'active', updated_at = NOW()
WHERE name = 'productivity-tracker' OR title = 'Productivity Tracker';

-- Verify the update
SELECT name, title, status FROM modules WHERE name = 'productivity-tracker' OR title = 'Productivity Tracker';
