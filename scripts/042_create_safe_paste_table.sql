-- Create Safe Paste table for development
-- This script sets up the safe_pastes table with permissive access for development

-- Drop existing table if it exists (to start fresh)
DROP TABLE IF EXISTS safe_pastes CASCADE;

-- Create safe_pastes table
CREATE TABLE safe_pastes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL, -- Using TEXT to allow placeholder values for development
    title TEXT,
    content TEXT NOT NULL,
    format TEXT NOT NULL DEFAULT 'plain_text' CHECK (
        format IN ('plain_text', 'source_code', 'markdown')
    ),
    language TEXT NOT NULL DEFAULT 'text',
    visibility TEXT NOT NULL DEFAULT 'unlisted' CHECK (
        visibility IN ('public', 'private', 'unlisted')
    ),
    password TEXT,
    burn_after_reading BOOLEAN DEFAULT false,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    views INTEGER DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_safe_pastes_user_id ON safe_pastes(user_id);
CREATE INDEX IF NOT EXISTS idx_safe_pastes_visibility ON safe_pastes(visibility);
CREATE INDEX IF NOT EXISTS idx_safe_pastes_language ON safe_pastes(language);
CREATE INDEX IF NOT EXISTS idx_safe_pastes_format ON safe_pastes(format);
CREATE INDEX IF NOT EXISTS idx_safe_pastes_created_at ON safe_pastes(created_at);
CREATE INDEX IF NOT EXISTS idx_safe_pastes_expires_at ON safe_pastes(expires_at);

-- Create a permissive policy that allows all operations for public role (development)
CREATE POLICY "Allow all operations on safe_pastes" ON safe_pastes
    FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);

-- Grant permissions
GRANT ALL ON safe_pastes TO authenticated;
GRANT ALL ON safe_pastes TO anon;

-- Insert some sample data for testing
INSERT INTO safe_pastes (user_id, title, content, format, language, visibility, password, burn_after_reading, views) VALUES
('dev-user-001', 'Sample JavaScript Code', 'console.log("Hello, World!");\n\nfunction greet(name) {\n    return `Hello, ${name}!`;\n}\n\ngreet("Developer");', 'source_code', 'javascript', 'public', NULL, false, 5),
('dev-user-001', 'Python Hello World', 'def hello_world():\n    print("Hello, World!")\n    return "Hello, World!"\n\nif __name__ == "__main__":\n    hello_world()', 'source_code', 'python', 'unlisted', NULL, false, 2),
('dev-user-001', 'SQL Query Example', 'SELECT \n    u.name,\n    u.email,\n    COUNT(o.id) as order_count\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE u.active = true\nGROUP BY u.id, u.name, u.email\nHAVING COUNT(o.id) > 0\nORDER BY order_count DESC;', 'source_code', 'sql', 'public', NULL, false, 8),
('dev-user-001', 'Configuration File', '# Database Configuration\nDB_HOST=localhost\nDB_PORT=5432\nDB_NAME=myapp\nDB_USER=admin\nDB_PASSWORD=secret\n\n# API Configuration\nAPI_KEY=your-api-key-here\nAPI_URL=https://api.example.com\n\n# Logging\nLOG_LEVEL=INFO\nLOG_FILE=/var/log/app.log', 'plain_text', 'config', 'private', 'secret123', true, 1),
('dev-user-001', 'Error Log Sample', '[2025-01-15 10:30:15] ERROR: Database connection failed\n[2025-01-15 10:30:16] INFO: Retrying connection...\n[2025-01-15 10:30:17] ERROR: Connection timeout\n[2025-01-15 10:30:18] WARN: Using fallback database\n[2025-01-15 10:30:19] INFO: Connection established successfully', 'plain_text', 'log', 'unlisted', NULL, false, 3),
('dev-user-001', 'Markdown Example', '# Welcome to Safe Paste\n\nThis is a **markdown** example with:\n\n- *Italic text*\n- `Inline code`\n- [Links](https://example.com)\n\n## Code Block\n```javascript\nconsole.log("Hello World");\n```\n\n> This is a blockquote\n\n---\n\nEnd of example', 'markdown', 'markdown', 'public', NULL, false, 4);

-- Verify the setup
SELECT 
    schemaname, 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'safe_pastes';

-- Verify the policy is created
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check
FROM pg_policies 
WHERE tablename = 'safe_pastes';

-- Show table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'safe_pastes'
ORDER BY ordinal_position;

-- Show sample data
SELECT id, title, format, language, visibility, password IS NOT NULL as has_password, burn_after_reading, views, created_at FROM safe_pastes ORDER BY created_at DESC LIMIT 5;
