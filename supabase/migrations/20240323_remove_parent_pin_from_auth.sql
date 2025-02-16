-- Remove parent_pin column from auth.users if it exists
ALTER TABLE auth.users DROP COLUMN IF EXISTS parent_pin; 