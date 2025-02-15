-- Enable the pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the cron job to reset tasks daily at midnight Sydney time
SELECT cron.schedule(
  'reset-tasks-daily',  -- unique job name
  '0 0 * * *',         -- cron schedule (midnight every day)
  $$
  -- Reset all completed tasks
  UPDATE tasks
  SET completed = false,
      completed_at = NULL,
      completion_date = NULL
  WHERE completed = true;
  $$
); 