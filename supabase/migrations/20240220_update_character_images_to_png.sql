-- Update character images to use PNG format
UPDATE rewards
SET image_url = CASE name
    WHEN 'Rookie Ranger' THEN 'https://api.dicebear.com/7.x/adventurer/png?seed=rookie&backgroundColor=b6e3f4&eyes=variant12&mouth=variant15&hair=short16&skinColor=ecad80'
    WHEN 'Star Scout' THEN 'https://api.dicebear.com/7.x/adventurer/png?seed=star&backgroundColor=ffdfbf&eyes=variant03&mouth=variant12&hair=long19&hairColor=0e0e0e&skinColor=f8b788'
    WHEN 'Elite Explorer' THEN 'https://api.dicebear.com/7.x/adventurer/png?seed=elite&backgroundColor=c0aede&eyes=variant04&mouth=variant07&hair=long16&hairColor=cb6d51&skinColor=ecad80'
    WHEN 'Master Adventurer' THEN 'https://api.dicebear.com/7.x/adventurer/png?seed=master&backgroundColor=d1d4f9&eyes=variant09&mouth=variant26&hair=long21&hairColor=85c2c6&skinColor=f2d3b1'
    WHEN 'Legend Hero' THEN 'https://api.dicebear.com/7.x/adventurer/png?seed=legend&backgroundColor=ffd5dc&eyes=variant08&mouth=variant04&hair=long24&hairColor=ff488e&skinColor=eeb687'
END
WHERE type = 'character'; 