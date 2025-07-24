-- Add description and author columns to videos table
ALTER TABLE videos 
ADD COLUMN description TEXT,
ADD COLUMN author TEXT;

-- Set default values for existing records
UPDATE videos 
SET 
  description = 'วิดีโอจาก FORD STYLE ME',
  author = 'Ford Thailand'
WHERE description IS NULL OR author IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN videos.description IS 'Video description, defaults to "วิดีโอจาก FORD STYLE ME" if empty';
COMMENT ON COLUMN videos.author IS 'Video author/channel name, defaults to "Ford Thailand" if empty';