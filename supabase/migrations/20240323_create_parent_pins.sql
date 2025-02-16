-- Create parent_pins table
CREATE TABLE IF NOT EXISTS parent_pins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    pin VARCHAR(6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS update_parent_pins_updated_at ON parent_pins;

-- Create or replace trigger function
CREATE OR REPLACE FUNCTION update_parent_pins_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_parent_pins_updated_at
    BEFORE UPDATE ON parent_pins
    FOR EACH ROW
    EXECUTE FUNCTION update_parent_pins_updated_at();

-- Enable Row Level Security
ALTER TABLE parent_pins ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own PIN" ON parent_pins;
DROP POLICY IF EXISTS "Users can insert their own PIN" ON parent_pins;
DROP POLICY IF EXISTS "Users can update their own PIN" ON parent_pins;

-- Create policies
CREATE POLICY "Users can view their own PIN"
    ON parent_pins FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own PIN"
    ON parent_pins FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own PIN"
    ON parent_pins FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id); 