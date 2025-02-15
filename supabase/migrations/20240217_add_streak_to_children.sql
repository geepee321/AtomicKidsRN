-- First, temporarily drop the NOT NULL constraint if it exists
DO $$ 
BEGIN
    ALTER TABLE children
    ALTER COLUMN streak DROP NOT NULL;
EXCEPTION
    WHEN undefined_column THEN
        -- Column doesn't exist yet, create it
        ALTER TABLE children
        ADD COLUMN streak INTEGER;
END $$;

-- Update any NULL values to 0
UPDATE children
SET streak = 0
WHERE streak IS NULL;

-- Now add the NOT NULL constraint and default value
ALTER TABLE children
ALTER COLUMN streak SET NOT NULL,
ALTER COLUMN streak SET DEFAULT 0;

-- Add last_completed_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'children' 
        AND column_name = 'last_completed_at'
    ) THEN
        ALTER TABLE children
        ADD COLUMN last_completed_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$; 