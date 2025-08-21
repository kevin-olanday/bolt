-- Enable the Productivity Tracker module
UPDATE modules 
SET status = 'active', 
    button_text = 'Open Tracker'
WHERE name = 'productivity_tracker';
