-- Create enum for reward types
CREATE TYPE reward_type AS ENUM ('character');

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type reward_type NOT NULL,
    streak_requirement INTEGER NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create child_rewards table to track unlocked rewards
CREATE TABLE IF NOT EXISTS child_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES children(id) ON DELETE CASCADE,
    reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(child_id, reward_id)
);

-- Add selected_character_id to children table
ALTER TABLE children
ADD COLUMN selected_character_id UUID REFERENCES rewards(id);

-- Insert some initial character rewards
INSERT INTO rewards (name, type, streak_requirement, image_url) VALUES
('Rookie Ranger', 'character', 0, 'https://api.dicebear.com/7.x/adventurer/svg?seed=rookie'),
('Star Scout', 'character', 3, 'https://api.dicebear.com/7.x/adventurer/svg?seed=star'),
('Elite Explorer', 'character', 7, 'https://api.dicebear.com/7.x/adventurer/svg?seed=elite'),
('Master Adventurer', 'character', 14, 'https://api.dicebear.com/7.x/adventurer/svg?seed=master'),
('Legend Hero', 'character', 30, 'https://api.dicebear.com/7.x/adventurer/svg?seed=legend');

-- Update all existing children to have the default character
WITH default_character AS (
    SELECT id FROM rewards WHERE streak_requirement = 0 LIMIT 1
)
UPDATE children
SET selected_character_id = (SELECT id FROM default_character)
WHERE selected_character_id IS NULL; 