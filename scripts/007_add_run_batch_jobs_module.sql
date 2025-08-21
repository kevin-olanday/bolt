-- Add Run Batch Jobs module to the modules table
INSERT INTO modules (
  name,
  title,
  description,
  icon,
  status,
  sort_order,
  button_text,
  button_action
) VALUES (
  'run_batch_jobs',
  'Run Batch Jobs',
  'Execute automated batch processes',
  'Play',
  'coming_soon',
  9,
  'Run Jobs',
  'run_jobs'
);
