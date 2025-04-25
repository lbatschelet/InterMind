-- ===========================
-- 1️⃣ CREATE SCREEN CONTENT TABLE
-- ===========================

-- Table: screen_content (stores content for screens like About, Privacy Policy, etc.)
CREATE TABLE screen_content (
    id TEXT PRIMARY KEY, -- content identifier: "about", "privacy", etc.
    type TEXT NOT NULL, -- content type: "markdown", "html", etc.
    image_key TEXT, -- key for the image to be shown (from SvgRegistry)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: screen_content_translations (stores translations for screen content)
CREATE TABLE screen_content_translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id TEXT NOT NULL REFERENCES screen_content(id) ON DELETE CASCADE,
    language TEXT NOT NULL REFERENCES languages(code) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(content_id, language)
);

-- ===========================
-- 2️⃣ INSERT INITIAL CONTENT
-- ===========================

-- Insert About screen content
INSERT INTO screen_content (id, type, image_key) VALUES
('about', 'markdown', 'everyday-design');

-- Insert Privacy Policy screen content
INSERT INTO screen_content (id, type, image_key) VALUES
('privacy', 'markdown', 'location-search');

-- Insert Consent screen content
INSERT INTO screen_content (id, type, image_key) VALUES
('consent', 'markdown', 'contract');

-- ===========================
-- 3️⃣ ENABLE ROW LEVEL SECURITY (RLS)
-- ===========================
ALTER TABLE screen_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE screen_content_translations ENABLE ROW LEVEL SECURITY;

-- ===========================
-- 4️⃣ SET UP RLS POLICIES
-- ===========================

-- Allow reading screen content for everyone
CREATE POLICY "Allow all to read screen content"
ON screen_content
FOR SELECT USING (TRUE);

-- Allow reading screen content translations for everyone
CREATE POLICY "Allow all to read screen content translations"
ON screen_content_translations
FOR SELECT USING (TRUE);

-- ===========================
-- 5️⃣ CREATE INDEXES
-- ===========================

-- Index for content translations by language
CREATE INDEX idx_screen_content_translations_language ON screen_content_translations(language);

-- Index for content translations by content_id
CREATE INDEX idx_screen_content_translations_content_id ON screen_content_translations(content_id);
