-- Ensure order values are unique per user by resetting them
WITH ordered_children AS (
  SELECT id, user_id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) - 1 as row_num
  FROM children
)
UPDATE children
SET "order" = ordered_children.row_num
FROM ordered_children
WHERE children.id = ordered_children.id;

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_order_per_user'
  ) THEN
    ALTER TABLE children ADD CONSTRAINT unique_order_per_user UNIQUE (user_id, "order");
  END IF;
END $$; 