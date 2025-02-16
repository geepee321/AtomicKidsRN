-- Add parent_pin column to auth.users if it doesn't exist
ALTER TABLE auth.users
ADD COLUMN IF NOT EXISTS parent_pin VARCHAR(6);

-- Set all existing parent_pin values to NULL
UPDATE auth.users
SET parent_pin = NULL; 