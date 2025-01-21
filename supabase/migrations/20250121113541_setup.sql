SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE TYPE "public"."question_type" AS ENUM (
    'single_choice',
    'multiple_choice',
    'slider',
    'text'
);


ALTER TYPE "public"."question_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."debug_rls"() RETURNS TABLE("current_device_id" "text", "current_claims" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY SELECT 
        current_setting('app.device_id', true),
        current_setting('request.jwt.claims', true)::jsonb;
END;
$$;


ALTER FUNCTION "public"."debug_rls"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."debug_session"() RETURNS TABLE("device_id" "text", "current_session_user" "text", "is_rls_enabled" boolean)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        current_setting('app.device_id'::text),
        current_user::text,
        EXISTS (
            SELECT 1 
            FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename = 'assessments' 
            AND rowsecurity = true
        );
END;
$$;


ALTER FUNCTION "public"."debug_session"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_device_id"("device_id" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    PERFORM set_config('app.device_id', device_id, false);
    RAISE NOTICE 'Set device_id to %', device_id;
END;
$$;


ALTER FUNCTION "public"."set_device_id"("device_id" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_question_type"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.question_type := (SELECT type FROM questions WHERE id = NEW.question_id);
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_question_type"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."assessment_answers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "assessment_id" "uuid" NOT NULL,
    "question_id" "uuid" NOT NULL,
    "answer_value" "jsonb" NOT NULL,
    "question_type" "public"."question_type" NOT NULL,
    "answered_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "valid_answer" CHECK (
CASE
    WHEN ("question_type" = 'single_choice'::"public"."question_type") THEN ("jsonb_typeof"("answer_value") = 'number'::"text")
    WHEN ("question_type" = 'multiple_choice'::"public"."question_type") THEN ("jsonb_typeof"("answer_value") = 'array'::"text")
    WHEN ("question_type" = 'slider'::"public"."question_type") THEN ("jsonb_typeof"("answer_value") = 'number'::"text")
    WHEN ("question_type" = 'text'::"public"."question_type") THEN ("jsonb_typeof"("answer_value") = 'string'::"text")
    ELSE false
END)
);

ALTER TABLE ONLY "public"."assessment_answers" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."assessment_answers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."assessments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "device_id" "text" NOT NULL,
    "started_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "location" "jsonb"
);

ALTER TABLE ONLY "public"."assessments" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."assessments" OWNER TO "postgres";


COMMENT ON COLUMN "public"."assessments"."location" IS 'Stores location data as {lat: number, lng: number, accuracy?: number, timestamp: number}';



CREATE TABLE IF NOT EXISTS "public"."questions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "question" "text" NOT NULL,
    "type" "public"."question_type" NOT NULL,
    "options" "jsonb",
    "category" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "valid_options" CHECK (
CASE
    WHEN ("type" = 'single_choice'::"public"."question_type") THEN (("jsonb_typeof"("options") = 'array'::"text") AND ("jsonb_array_length"("options") > 0))
    WHEN ("type" = 'multiple_choice'::"public"."question_type") THEN (("jsonb_typeof"("options") = 'array'::"text") AND ("jsonb_array_length"("options") > 0))
    WHEN ("type" = 'slider'::"public"."question_type") THEN (("options" ? 'min'::"text") AND ("options" ? 'max'::"text") AND ("options" ? 'step'::"text"))
    WHEN ("type" = 'text'::"public"."question_type") THEN ("options" IS NULL)
    ELSE false
END)
);

ALTER TABLE ONLY "public"."questions" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."questions" OWNER TO "postgres";


ALTER TABLE ONLY "public"."assessment_answers"
    ADD CONSTRAINT "assessment_answers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."assessments"
    ADD CONSTRAINT "assessments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."questions"
    ADD CONSTRAINT "questions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."assessment_answers"
    ADD CONSTRAINT "unique_answer_per_question" UNIQUE ("assessment_id", "question_id");



CREATE INDEX "idx_assessment_answers_assessment_id" ON "public"."assessment_answers" USING "btree" ("assessment_id");



CREATE INDEX "idx_assessment_answers_question_id" ON "public"."assessment_answers" USING "btree" ("question_id");



CREATE INDEX "idx_assessments_device_id" ON "public"."assessments" USING "btree" ("device_id");



CREATE INDEX "idx_questions_category" ON "public"."questions" USING "btree" ("category");



CREATE INDEX "idx_questions_type" ON "public"."questions" USING "btree" ("type");



CREATE OR REPLACE TRIGGER "set_question_type_trigger" BEFORE INSERT OR UPDATE ON "public"."assessment_answers" FOR EACH ROW EXECUTE FUNCTION "public"."set_question_type"();



ALTER TABLE ONLY "public"."assessment_answers"
    ADD CONSTRAINT "assessment_answers_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."assessment_answers"
    ADD CONSTRAINT "assessment_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE CASCADE;



CREATE POLICY "answers_device_policy" ON "public"."assessment_answers" TO "authenticated", "anon" USING ((EXISTS ( SELECT 1
   FROM "public"."assessments" "a"
  WHERE (("a"."id" = "assessment_answers"."assessment_id") AND
        CASE
            WHEN ("current_setting"('app.device_id'::"text", true) IS NULL) THEN false
            ELSE ("a"."device_id" = "current_setting"('app.device_id'::"text", true))
        END)))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."assessments" "a"
  WHERE (("a"."id" = "assessment_answers"."assessment_id") AND
        CASE
            WHEN ("current_setting"('app.device_id'::"text", true) IS NULL) THEN false
            ELSE ("a"."device_id" = "current_setting"('app.device_id'::"text", true))
        END))));



ALTER TABLE "public"."assessment_answers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."assessments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "assessments_device_policy_select" ON "public"."assessments" 
FOR SELECT
TO "authenticated", "anon" 
USING (
    CASE
        WHEN ("current_setting"('app.device_id'::"text", true) IS NULL) THEN false
        ELSE ("device_id" = "current_setting"('app.device_id'::"text", true))
    END
);

CREATE POLICY "assessments_device_policy_insert" ON "public"."assessments" 
FOR INSERT
TO "authenticated", "anon" 
WITH CHECK (
    CASE
        WHEN ("current_setting"('app.device_id'::"text", true) IS NULL) THEN false
        ELSE ("device_id" = "current_setting"('app.device_id'::"text", true))
    END
);

CREATE POLICY "assessments_device_policy_update" ON "public"."assessments" 
FOR UPDATE
TO "authenticated", "anon" 
USING (
    CASE
        WHEN ("current_setting"('app.device_id'::"text", true) IS NULL) THEN false
        ELSE ("device_id" = "current_setting"('app.device_id'::"text", true))
    END
)
WITH CHECK (
    CASE
        WHEN ("current_setting"('app.device_id'::"text", true) IS NULL) THEN false
        ELSE ("device_id" = "current_setting"('app.device_id'::"text", true))
    END
);

CREATE POLICY "assessments_device_policy_delete" ON "public"."assessments" 
FOR DELETE
TO "authenticated", "anon" 
USING (
    CASE
        WHEN ("current_setting"('app.device_id'::"text", true) IS NULL) THEN false
        ELSE ("device_id" = "current_setting"('app.device_id'::"text", true))
    END
);



CREATE POLICY "device_can_create_answers_for_own_assessments" ON "public"."assessment_answers" FOR INSERT TO "authenticated", "anon" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."assessments" "a"
  WHERE (("a"."id" = "assessment_answers"."assessment_id") AND ("a"."device_id" = "current_setting"('app.device_id'::"text", true))))));



CREATE POLICY "device_can_view_own_assessment_answers" ON "public"."assessment_answers" FOR SELECT TO "authenticated", "anon" USING ((EXISTS ( SELECT 1
   FROM "public"."assessments" "a"
  WHERE (("a"."id" = "assessment_answers"."assessment_id") AND ("a"."device_id" = "current_setting"('app.device_id'::"text", true))))));



ALTER TABLE "public"."questions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "questions_public_readable" ON "public"."questions" FOR SELECT TO "authenticated", "anon" USING (true);



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."debug_rls"() TO "anon";
GRANT ALL ON FUNCTION "public"."debug_rls"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."debug_rls"() TO "service_role";



GRANT ALL ON FUNCTION "public"."debug_session"() TO "anon";
GRANT ALL ON FUNCTION "public"."debug_session"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."debug_session"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_device_id"("device_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."set_device_id"("device_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_device_id"("device_id" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."set_question_type"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_question_type"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_question_type"() TO "service_role";



GRANT ALL ON TABLE "public"."assessment_answers" TO "anon";
GRANT ALL ON TABLE "public"."assessment_answers" TO "authenticated";
GRANT ALL ON TABLE "public"."assessment_answers" TO "service_role";



GRANT ALL ON TABLE "public"."assessments" TO "anon";
GRANT ALL ON TABLE "public"."assessments" TO "authenticated";
GRANT ALL ON TABLE "public"."assessments" TO "service_role";



GRANT ALL ON TABLE "public"."questions" TO "anon";
GRANT ALL ON TABLE "public"."questions" TO "authenticated";
GRANT ALL ON TABLE "public"."questions" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






RESET ALL;
