-- Remove description column if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'tasks' 
        AND column_name = 'description'
    ) THEN
        ALTER TABLE tasks
        DROP COLUMN description;
    END IF;
END $$; 