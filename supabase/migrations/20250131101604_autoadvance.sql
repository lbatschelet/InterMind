-- Add auto_advance column to questions table
ALTER TABLE "public"."questions"
ADD COLUMN auto_advance boolean DEFAULT false;

-- Set default auto_advance to true for existing single_choice questions
UPDATE "public"."questions"
SET auto_advance = true
WHERE type = 'single_choice';

-- Add a trigger to automatically set auto_advance for new single_choice questions
CREATE OR REPLACE FUNCTION set_default_auto_advance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.type = 'single_choice' AND NEW.auto_advance IS NULL THEN
        NEW.auto_advance := true;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_question_auto_advance
    BEFORE INSERT ON "public"."questions"
    FOR EACH ROW
    EXECUTE FUNCTION set_default_auto_advance();

-- Add comment for documentation
COMMENT ON COLUMN "public"."questions".auto_advance IS 'Determines if the question should automatically advance to the next question after answering. Defaults to true for single_choice questions.';
