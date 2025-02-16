-- First, drop the existing job if it exists
DO $$
BEGIN
    PERFORM cron.unschedule('reset-tasks-daily');
EXCEPTION WHEN OTHERS THEN
    -- Job might not exist, continue anyway
END $$;

-- Create a new job with UTC time (14:00 UTC = 00:00 Sydney)
SELECT cron.schedule(
    'reset-tasks-daily',    -- unique job name
    '0 14 * * *',          -- cron schedule (14:00 UTC = midnight Sydney time)
    $$
    -- Reset all completed tasks
    UPDATE tasks
    SET completed = false,
        completed_at = NULL
    WHERE completed = true;
    $$
);

-- Verify the job settings
SELECT * FROM cron.job WHERE jobname = 'reset-tasks-daily'; 