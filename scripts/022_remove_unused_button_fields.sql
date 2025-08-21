-- Remove unused button_text and button_action fields from modules table
-- These fields are not used in the application - routing is handled by module registry
-- and button text is hardcoded to "Launch" in the dashboard card component

ALTER TABLE modules 
DROP COLUMN IF EXISTS button_text,
DROP COLUMN IF EXISTS button_action;

-- Verify the table structure after cleanup
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'modules' 
AND table_schema = 'public'
ORDER BY ordinal_position;
