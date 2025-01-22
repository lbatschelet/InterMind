BEGIN;

-- Session-Einstellungen
SELECT set_config('app.device_id', NULL, false);  -- Start mit leerem device_id

-- Hilfsfunktion zum Setzen der device_id
CREATE OR REPLACE FUNCTION set_device_id(device_id text) RETURNS void AS $$
BEGIN
    PERFORM set_config('app.device_id', device_id, true);
END;
$$ LANGUAGE plpgsql;

-- Berechtigungen für anon setzen
GRANT EXECUTE ON FUNCTION set_device_id(text) TO anon;

-- Als anon-Benutzer fortfahren
SET ROLE anon;

-- Test 1: RLS ist aktiviert
DO $$
DECLARE
    is_rls_enabled boolean;
BEGIN
    SELECT relrowsecurity FROM pg_class WHERE relname = 'questions' INTO is_rls_enabled;
    RAISE NOTICE 'RLS enabled for questions: %', is_rls_enabled;
    ASSERT is_rls_enabled = true, 'RLS sollte für questions aktiviert sein';
    
    SELECT relrowsecurity FROM pg_class WHERE relname = 'assessments' INTO is_rls_enabled;
    RAISE NOTICE 'RLS enabled for assessments: %', is_rls_enabled;
    ASSERT is_rls_enabled = true, 'RLS sollte für assessments aktiviert sein';
    
    SELECT relrowsecurity FROM pg_class WHERE relname = 'assessment_answers' INTO is_rls_enabled;
    RAISE NOTICE 'RLS enabled for assessment_answers: %', is_rls_enabled;
    ASSERT is_rls_enabled = true, 'RLS sollte für assessment_answers aktiviert sein';
END $$;

-- Test 2: Questions sind öffentlich lesbar
DO $$
DECLARE
    count_before integer;
    count_after integer;
BEGIN
    SELECT COUNT(*) INTO count_before FROM questions;
    PERFORM set_device_id(NULL);
    SELECT COUNT(*) INTO count_after FROM questions;
    ASSERT count_before = count_after, 'Questions sollten ohne device_id lesbar sein';
END $$;

-- Test 3: Assessments - Device kann nur eigene sehen
DO $$
DECLARE
    visible_count integer;
BEGIN
    -- Test-User erstellen
    RESET ROLE;
    INSERT INTO auth.users (id, email) VALUES 
        ('11111111-1111-1111-1111-111111111111', 'test1@test.com'),
        ('22222222-2222-2222-2222-222222222222', 'test2@test.com')
    ON CONFLICT (id) DO NOTHING;
    
    -- Testdaten einfügen
    INSERT INTO assessments (device_id, user_id) 
    VALUES ('TEST-DEVICE-1', '11111111-1111-1111-1111-111111111111');
    INSERT INTO assessments (device_id, user_id) 
    VALUES ('TEST-DEVICE-2', '22222222-2222-2222-2222-222222222222');
    
    SET ROLE anon;
    SELECT rpc('set_device_id', '{"device_id": "TEST-DEVICE-1"}');
    SELECT COUNT(*) INTO visible_count FROM assessments;
    RAISE NOTICE 'Sichtbare Assessments: %', visible_count;
    ASSERT visible_count = 1, 'Device sollte nur eigene Assessments sehen';
END $$;

-- Test 3b: Assessments - Device kann eigene Assessments erstellen
DO $$
DECLARE
    created_assessment_id uuid;
    debug_device_id text;
BEGIN
    -- Als anon mit device_id versuchen ein Assessment zu erstellen
    SET ROLE anon;
    
    -- Device ID über RPC setzen (wie in der App)
    SELECT rpc('set_device_id', '{"device_id": "TEST-DEVICE-1"}');
    
    -- Debug: Prüfe device_id
    SELECT current_setting('app.device_id', true) INTO debug_device_id;
    RAISE NOTICE 'Current device_id before first insert: %', debug_device_id;
    
    -- Simuliere App-Insert
    INSERT INTO assessments (
        device_id, 
        user_id, 
        started_at,
        location
    ) 
    VALUES (
        'TEST-DEVICE-1',
        'TEST-DEVICE-1',
        NOW(),
        '{"latitude": 46.943, "longitude": 7.384}'::jsonb
    )
    RETURNING id INTO created_assessment_id;
    
    ASSERT created_assessment_id IS NOT NULL, 'Assessment sollte als anon erstellt werden können';
    
    -- Versuchen ein Assessment für ein anderes Device zu erstellen (sollte fehlschlagen)
    BEGIN
        -- Device ID über RPC setzen (wie in der App)
        SELECT rpc('set_device_id', '{"device_id": "TEST-DEVICE-2"}');
        
        -- Debug: Prüfe device_id
        SELECT current_setting('app.device_id', true) INTO debug_device_id;
        RAISE NOTICE 'Current device_id before second insert: %', debug_device_id;
        
        INSERT INTO assessments (
            device_id, 
            user_id, 
            started_at,
            location
        ) 
        VALUES (
            'TEST-DEVICE-2',
            'TEST-DEVICE-2',
            NOW(),
            '{"latitude": 46.943, "longitude": 7.384}'::jsonb
        );
        ASSERT false, 'Assessment für anderes Device sollte nicht erstellt werden können';
    EXCEPTION
        WHEN insufficient_privilege THEN
            RAISE NOTICE 'Got expected insufficient_privilege error';
            NULL;
    END;
END $$;

-- Test 4: Answers - Device kann nur Antworten zu eigenen Assessments sehen
DO $$
DECLARE
    visible_count integer;
    test_question_id uuid;
    test_question_type question_type;
    test_assessment_id uuid;
BEGIN
    -- Eine Frage für den Test holen
    SELECT id, type INTO test_question_id, test_question_type FROM questions LIMIT 1;
    
    -- Assessment ID holen
    SELECT id INTO test_assessment_id FROM assessments WHERE device_id = 'TEST-DEVICE-1';

    -- Testdaten einfügen
    RESET ROLE;
    INSERT INTO assessment_answers (assessment_id, question_id, answer_value) 
    VALUES (
        test_assessment_id,
        test_question_id,
        CASE test_question_type
            WHEN 'single_choice' THEN '1'::jsonb
            WHEN 'multiple_choice' THEN '[1, 2]'::jsonb
            WHEN 'slider' THEN '42'::jsonb
            WHEN 'text' THEN '"test"'::jsonb
        END
    );
    
    SET ROLE anon;
    SELECT rpc('set_device_id', '{"device_id": "TEST-DEVICE-1"}');
    SELECT COUNT(*) INTO visible_count FROM assessment_answers;
    RAISE NOTICE 'Sichtbare Answers: %', visible_count;
    ASSERT visible_count = 1, 'Device sollte nur Antworten zu eigenen Assessments sehen';
END $$;

-- Test 5: Debug-Funktion
DO $$
DECLARE
    debug_device_id text;
BEGIN
    SELECT device_id INTO debug_device_id FROM debug_session();
    ASSERT debug_device_id = 'TEST-DEVICE-1', 'Debug-Funktion sollte korrekte device_id zurückgeben';
END $$;

-- Aufräumen
RESET ROLE;
SELECT rpc('set_device_id', '{"device_id": null}');
DELETE FROM assessment_answers;
DELETE FROM assessments;
DELETE FROM auth.users WHERE id IN (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222'
);

ROLLBACK;
