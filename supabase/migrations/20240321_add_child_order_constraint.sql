-- Add a unique constraint to ensure order values are unique per user
ALTER TABLE children ADD CONSTRAINT unique_order_per_user UNIQUE (user_id, "order"); 