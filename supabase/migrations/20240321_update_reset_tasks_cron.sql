-- First, drop the existing job if it exists
DO $$
BEGIN
    PERFORM cron.unschedule('reset-tasks-daily');
EXCEPTION WHEN OTHERS THEN
    -- Job might not exist, continue anyway
END $$;

-- Create a new job with the updated query
SELECT cron.schedule(
    'reset-tasks-daily',    -- unique job name
    '0 0 * * *',           -- cron schedule (midnight every day)
    $$
    -- Reset all completed tasks
    UPDATE tasks
    SET completed = false,
        completed_at = NULL
    WHERE completed = true;
    $$
); 