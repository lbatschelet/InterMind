/**
 * Auth User Setup
 * --------------
 * This migration adds user isolation with authentication.
 * Each authenticated user can only access their own data.
 */

-- First, drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow devices to see own surveys" ON public.surveys;
DROP POLICY IF EXISTS "Allow anyone to insert surveys" ON public.surveys;
DROP POLICY IF EXISTS "Allow devices to update own surveys" ON public.surveys;
DROP POLICY IF EXISTS "Allow devices to delete own surveys" ON public.surveys;
DROP POLICY IF EXISTS "Allow inserting responses for own surveys" ON public.responses;
DROP POLICY IF EXISTS "Allow viewing own responses" ON public.responses;

-- Add auth_user_id column to both tables
ALTER TABLE public.surveys ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.responses ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);

-- Update existing data to use anonymous IDs
-- This is a safety step in case you already have data
CREATE OR REPLACE FUNCTION set_auth_user_id_for_surveys()
RETURNS void AS $$
DECLARE
BEGIN
    -- We're not actually setting IDs here since there's no way to know
    -- which anonymous user should own which survey without login info
    -- This is just a placeholder for the function 
    RAISE NOTICE 'Migrating surveys: this would set auth_user_id for existing surveys if we had login data';
END;
$$ LANGUAGE plpgsql;
SELECT set_auth_user_id_for_surveys();

-- Add a trigger to set auth_user_id on new surveys
CREATE OR REPLACE FUNCTION set_auth_user_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.auth_user_id := auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to both tables
DROP TRIGGER IF EXISTS set_auth_user_id_on_surveys ON public.surveys;
CREATE TRIGGER set_auth_user_id_on_surveys
    BEFORE INSERT ON public.surveys
    FOR EACH ROW
    EXECUTE FUNCTION set_auth_user_id();

DROP TRIGGER IF EXISTS set_auth_user_id_on_responses ON public.responses;
CREATE TRIGGER set_auth_user_id_on_responses
    BEFORE INSERT ON public.responses
    FOR EACH ROW
    EXECUTE FUNCTION set_auth_user_id();

-- Create simple policies based on auth_user_id
CREATE POLICY "Allow users to see own surveys"
ON public.surveys
FOR SELECT
TO authenticated
USING (auth_user_id = auth.uid());

-- Allow users to insert new surveys (the trigger will set auth_user_id)
CREATE POLICY "Allow users to insert surveys"
ON public.surveys
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow users to update only their own surveys
CREATE POLICY "Allow users to update own surveys"
ON public.surveys
FOR UPDATE
TO authenticated
USING (auth_user_id = auth.uid());

-- Allow users to delete only their own surveys
CREATE POLICY "Allow users to delete own surveys"
ON public.surveys
FOR DELETE
TO authenticated
USING (auth_user_id = auth.uid());

-- Allow users to insert responses only to their own surveys
CREATE POLICY "Allow inserting responses for own surveys"
ON public.responses
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.surveys s
        WHERE s.id = survey_id
        AND s.auth_user_id = auth.uid()
    )
);

-- Allow users to view only their own responses
CREATE POLICY "Allow viewing own responses"
ON public.responses
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.surveys s
        WHERE s.id = survey_id
        AND s.auth_user_id = auth.uid()
    )
);

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Allow all to read screen content" ON screen_content;
DROP POLICY IF EXISTS "Allow all to read screen content translations" ON screen_content_translations;

-- Allow both authenticated and anonymous users to read screen content 
CREATE POLICY "Allow anyone to read screen content"
ON screen_content
FOR SELECT 
TO authenticated, anon
USING (TRUE);

-- Allow both authenticated and anonymous users to read screen content translations
CREATE POLICY "Allow anyone to read screen content translations"
ON screen_content_translations
FOR SELECT
TO authenticated, anon
USING (TRUE); 

-- Helper function to debug auth state
CREATE OR REPLACE FUNCTION debug_auth()
RETURNS TABLE (
    user_id text,
    is_anonymous boolean,
    jwt_claims jsonb
) AS $$
BEGIN
    RETURN QUERY SELECT 
        auth.uid()::text,
        coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false),
        auth.jwt();
END;
$$ LANGUAGE plpgsql;
