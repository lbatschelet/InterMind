-- Zuerst die alten Constraints entfernen
ALTER TABLE "public"."assessment_answers" DROP CONSTRAINT IF EXISTS "assessment_answers_assessment_id_fkey";
ALTER TABLE "public"."assessment_answers" DROP CONSTRAINT IF EXISTS "assessment_answers_question_id_fkey";

-- Sequenzen entfernen falls sie existieren
DROP SEQUENCE IF EXISTS "public"."assessment_answers_id_seq";
DROP SEQUENCE IF EXISTS "public"."assessments_id_seq";
DROP SEQUENCE IF EXISTS "public"."questions_id_seq";

-- Spalten auf UUID umstellen
ALTER TABLE "public"."assessments" 
    ALTER COLUMN "id" SET DATA TYPE uuid USING (gen_random_uuid()),
    ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

ALTER TABLE "public"."questions" 
    ALTER COLUMN "id" SET DATA TYPE uuid USING (gen_random_uuid()),
    ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

ALTER TABLE "public"."assessment_answers" 
    ALTER COLUMN "id" SET DATA TYPE uuid USING (gen_random_uuid()),
    ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
    ALTER COLUMN "assessment_id" SET DATA TYPE uuid USING (gen_random_uuid()),
    ALTER COLUMN "question_id" SET DATA TYPE uuid USING (gen_random_uuid());

-- Foreign Keys wieder hinzufügen
ALTER TABLE "public"."assessment_answers" 
    ADD CONSTRAINT "assessment_answers_assessment_id_fkey" 
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE;

ALTER TABLE "public"."assessment_answers" 
    ADD CONSTRAINT "assessment_answers_question_id_fkey" 
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE; 