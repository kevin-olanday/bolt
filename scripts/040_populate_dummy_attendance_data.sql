-- Populate dummy attendance data for July and August 2025
-- This script creates realistic attendance patterns for testing the attendance module

-- Clear existing data for July and August 2025
DELETE FROM attendance 
WHERE date >= '2025-07-01' AND date <= '2025-08-31';

-- Insert July 2025 data
INSERT INTO attendance (user_id, date, attendance_type, notes) VALUES
-- Week 1 (July 1-7)
('00000000-0000-0000-0000-000000000000', '2025-07-01', 'In Office', 'Tuesday - Team meeting day'),
('00000000-0000-0000-0000-000000000000', '2025-07-02', 'Work From Home (WFH)', 'WFH Wednesday - Focus on coding'),
('00000000-0000-0000-0000-000000000000', '2025-07-03', 'In Office', 'Thursday - Client presentation'),
('00000000-0000-0000-0000-000000000000', '2025-07-04', 'Holiday', 'Independence Day'),
('00000000-0000-0000-0000-000000000000', '2025-07-05', 'Off Day', 'Weekend'),
('00000000-0000-0000-0000-000000000000', '2025-07-06', 'Off Day', 'Weekend'),
('00000000-0000-0000-0000-000000000000', '2025-07-07', 'In Office', 'Monday - Project review'),

-- Week 2 (July 8-14)
('00000000-0000-0000-0000-000000000000', '2025-07-08', 'In Office', 'Tuesday - Weekly planning'),
('00000000-0000-0000-0000-000000000000', '2025-07-09', 'Work From Home (WFH)', 'WFH Wednesday - Deep work session'),
('00000000-0000-0000-0000-000000000000', '2025-07-10', 'In Office', 'Thursday - Team collaboration'),
('00000000-0000-0000-0000-000000000000', '2025-07-11', 'Half Day', 'Half day - Doctor appointment'),
('00000000-0000-0000-0000-000000000000', '2025-07-12', 'Off Day', 'Weekend'),
('00000000-0000-0000-0000-000000000000', '2025-07-13', 'Off Day', 'Weekend'),
('00000000-0000-0000-0000-000000000000', '2025-07-14', 'In Office', 'Monday - Sprint planning'),

-- Week 3 (July 15-21)
('00000000-0000-0000-0000-000000000000', '2025-07-15', 'In Office', 'Tuesday - Project kickoff'),
('00000000-0000-0000-0000-000000000000', '2025-07-16', 'Work From Home (WFH)', 'WFH Wednesday - Code review'),
('00000000-0000-0000-0000-000000000000', '2025-07-17', 'In Office', 'Thursday - Stakeholder meeting'),
('00000000-0000-0000-0000-000000000000', '2025-07-18', 'In Office', 'Friday - Development work'),
('00000000-0000-0000-0000-000000000000', '2025-07-19', 'Planned Leave', 'Vacation day - Long weekend'),
('00000000-0000-0000-0000-000000000000', '2025-07-20', 'Off Day', 'Weekend'),
('00000000-0000-0000-0000-000000000000', '2025-07-21', 'Off Day', 'Weekend'),

-- Week 4 (July 22-28)
('00000000-0000-0000-0000-000000000000', '2025-07-22', 'In Office', 'Tuesday - Back from vacation'),
('00000000-0000-0000-0000-000000000000', '2025-07-23', 'Work From Home (WFH)', 'WFH Wednesday - Catch up work'),
('00000000-0000-0000-0000-000000000000', '2025-07-24', 'In Office', 'Thursday - Team retrospective'),
('00000000-0000-0000-0000-000000000000', '2025-07-25', 'In Office', 'Friday - Code deployment'),
('00000000-0000-0000-0000-000000000000', '2025-07-26', 'Off Day', 'Weekend'),
('00000000-0000-0000-0000-000000000000', '2025-07-27', 'Off Day', 'Weekend'),
('00000000-0000-0000-0000-000000000000', '2025-07-28', 'In Office', 'Monday - Weekly review'),

-- Week 5 (July 29-31)
('00000000-0000-0000-0000-000000000000', '2025-07-29', 'In Office', 'Tuesday - Month end review'),
('00000000-0000-0000-0000-000000000000', '2025-07-30', 'Work From Home (WFH)', 'WFH Wednesday - Documentation'),
('00000000-0000-0000-0000-000000000000', '2025-07-31', 'In Office', 'Thursday - July wrap up'),

-- Insert August 2025 data
-- Week 1 (August 1-3) - August 1 is Friday, Aug 2-3 are weekend
('00000000-0000-0000-0000-000000000000', '2025-08-01', 'In Office', 'Friday - August kickoff'),
('00000000-0000-0000-0000-000000000000', '2025-08-02', 'Off Day', 'Weekend'),
('00000000-0000-0000-0000-000000000000', '2025-08-03', 'Off Day', 'Weekend'),

-- Week 2 (August 4-10) - Aug 4 is Monday, Aug 9-10 are weekend
('00000000-0000-0000-0000-000000000000', '2025-08-04', 'In Office', 'Monday - Weekly planning'),
('00000000-0000-0000-0000-000000000000', '2025-08-05', 'Work From Home (WFH)', 'WFH Tuesday - Focus work'),
('00000000-0000-0000-0000-000000000000', '2025-08-06', 'In Office', 'Wednesday - Client meeting'),
('00000000-0000-0000-0000-000000000000', '2025-08-07', 'In Office', 'Thursday - Development'),
('00000000-0000-0000-0000-000000000000', '2025-08-08', 'Half Day', 'Half day - Personal errands'),
('00000000-0000-0000-0000-000000000000', '2025-08-09', 'Off Day', 'Weekend'),
('00000000-0000-0000-0000-000000000000', '2025-08-10', 'Off Day', 'Weekend'),

-- Week 3 (August 11-17) - Aug 11 is Monday, Aug 16-17 are weekend
('00000000-0000-0000-0000-000000000000', '2025-08-11', 'In Office', 'Monday - Project milestone'),
('00000000-0000-0000-0000-000000000000', '2025-08-12', 'Work From Home (WFH)', 'WFH Tuesday - Deep coding'),
('00000000-0000-0000-0000-000000000000', '2025-08-13', 'In Office', 'Wednesday - Team sync'),
('00000000-0000-0000-0000-000000000000', '2025-08-14', 'Sick Leave', 'Not feeling well'),
('00000000-0000-0000-0000-000000000000', '2025-08-15', 'In Office', 'Friday - Back to work'),
('00000000-0000-0000-0000-000000000000', '2025-08-16', 'Off Day', 'Weekend'),
('00000000-0000-0000-0000-000000000000', '2025-08-17', 'Off Day', 'Weekend'),

-- Week 4 (August 18-24) - Aug 18 is Monday, Aug 23-24 are weekend
('00000000-0000-0000-0000-000000000000', '2025-08-18', 'In Office', 'Monday - Weekly review'),
('00000000-0000-0000-0000-000000000000', '2025-08-19', 'Work From Home (WFH)', 'WFH Tuesday - Code review'),
('00000000-0000-0000-0000-000000000000', '2025-08-20', 'In Office', 'Wednesday - Stakeholder demo'),
('00000000-0000-0000-0000-000000000000', '2025-08-21', 'In Office', 'Thursday - Development work'),
('00000000-0000-0000-0000-000000000000', '2025-08-22', 'Volunteer Leave', 'Community service day'),
('00000000-0000-0000-0000-000000000000', '2025-08-23', 'Off Day', 'Weekend'),
('00000000-0000-0000-0000-000000000000', '2025-08-24', 'Off Day', 'Weekend'),

-- Week 5 (August 25-31) - Aug 25 is Monday, Aug 30-31 are weekend
('00000000-0000-0000-0000-000000000000', '2025-08-25', 'In Office', 'Monday - Month end planning'),
('00000000-0000-0000-0000-000000000000', '2025-08-26', 'Work From Home (WFH)', 'WFH Tuesday - Documentation'),
('00000000-0000-0000-0000-000000000000', '2025-08-27', 'In Office', 'Wednesday - Team meeting'),
('00000000-0000-0000-0000-000000000000', '2025-08-28', 'In Office', 'Thursday - Project delivery'),
('00000000-0000-0000-0000-000000000000', '2025-08-29', 'In Office', 'Friday - August wrap up'),
('00000000-0000-0000-0000-000000000000', '2025-08-30', 'Off Day', 'Weekend'),
('00000000-0000-0000-0000-000000000000', '2025-08-31', 'Off Day', 'Weekend');

-- Verify the data was inserted
SELECT 
    date,
    attendance_type,
    notes
FROM attendance 
WHERE date >= '2025-07-01' AND date <= '2025-08-31'
ORDER BY date;

-- Show summary statistics
SELECT 
    COUNT(*) as total_entries,
    COUNT(CASE WHEN attendance_type = 'In Office' THEN 1 END) as in_office_days,
    COUNT(CASE WHEN attendance_type = 'Work From Home (WFH)' THEN 1 END) as wfh_days,
    COUNT(CASE WHEN attendance_type IN ('Planned Leave', 'Sick Leave', 'Emergency Leave') THEN 1 END) as leave_days,
    COUNT(CASE WHEN attendance_type = 'Holiday' THEN 1 END) as holiday_days,
    COUNT(CASE WHEN attendance_type = 'Half Day' THEN 1 END) as half_days,
    COUNT(CASE WHEN attendance_type = 'Volunteer Leave' THEN 1 END) as volunteer_days,
    COUNT(CASE WHEN attendance_type = 'Off Day' THEN 1 END) as off_days
FROM attendance 
WHERE date >= '2025-07-01' AND date <= '2025-08-31';
