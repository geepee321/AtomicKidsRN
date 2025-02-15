DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'tasks' 
        AND column_name = 'icon_name'
    ) THEN
        ALTER TABLE tasks
        ADD COLUMN icon_name VARCHAR(100);

        -- Update existing tasks to have a default icon
        UPDATE tasks
        SET icon_name = 'checkbox-blank-circle-outline'
        WHERE icon_name IS NULL;
    END IF;
END $$; 