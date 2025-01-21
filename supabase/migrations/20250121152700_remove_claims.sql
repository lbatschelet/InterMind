-- Remove claims references from debug functions
DROP FUNCTION IF EXISTS "public"."debug_rls";

CREATE OR REPLACE FUNCTION "public"."debug_rls"() 
RETURNS TABLE("current_device_id" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY SELECT 
        current_setting('app.device_id', true);
END;
$$;

-- Update function owner
ALTER FUNCTION "public"."debug_rls"() OWNER TO "postgres"; 