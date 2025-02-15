-- First, drop the existing job if it exists
DO $$
BEGIN
    PERFORM cron.unschedule('reset-tasks-daily');
EXCEPTION WHEN OTHERS THEN
    -- Job might not exist, continue anyway
END $$;

-- Set the timezone parameter for the entire database session
ALTER DATABASE postgres SET timezone TO 'Australia/Sydney';

-- Create a new job with the correct schedule
SELECT cron.schedule(
    'reset-tasks-daily',    -- unique job name
    '0 0 * * *',           -- cron schedule (midnight Sydney time, because of database timezone)
    $$
    UPDATE tasks
    SET completed = false,
        completed_at = NULL,
        completion_date = NULL
    WHERE completed = true;
    $$
);

-- Verify the timezone setting
SHOW timezone; 