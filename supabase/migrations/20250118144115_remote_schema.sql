drop trigger if exists "set_question_type_trigger" on "public"."assessment_answers";

drop policy "Nutzer können nur Antworten zu eigenen Assessments sehen und e" on "public"."assessment_answers";

drop policy "Nutzer können nur eigene Assessments sehen und bearbeiten" on "public"."assessments";

drop policy "Questions sind öffentlich lesbar" on "public"."questions";

revoke delete on table "public"."assessment_answers" from "anon";

revoke insert on table "public"."assessment_answers" from "anon";

revoke references on table "public"."assessment_answers" from "anon";

revoke select on table "public"."assessment_answers" from "anon";

revoke trigger on table "public"."assessment_answers" from "anon";

revoke truncate on table "public"."assessment_answers" from "anon";

revoke update on table "public"."assessment_answers" from "anon";

revoke delete on table "public"."assessment_answers" from "authenticated";

revoke insert on table "public"."assessment_answers" from "authenticated";

revoke references on table "public"."assessment_answers" from "authenticated";

revoke select on table "public"."assessment_answers" from "authenticated";

revoke trigger on table "public"."assessment_answers" from "authenticated";

revoke truncate on table "public"."assessment_answers" from "authenticated";

revoke update on table "public"."assessment_answers" from "authenticated";

revoke delete on table "public"."assessment_answers" from "service_role";

revoke insert on table "public"."assessment_answers" from "service_role";

revoke references on table "public"."assessment_answers" from "service_role";

revoke select on table "public"."assessment_answers" from "service_role";

revoke trigger on table "public"."assessment_answers" from "service_role";

revoke truncate on table "public"."assessment_answers" from "service_role";

revoke update on table "public"."assessment_answers" from "service_role";

revoke delete on table "public"."assessments" from "anon";

revoke insert on table "public"."assessments" from "anon";

revoke references on table "public"."assessments" from "anon";

revoke select on table "public"."assessments" from "anon";

revoke trigger on table "public"."assessments" from "anon";

revoke truncate on table "public"."assessments" from "anon";

revoke update on table "public"."assessments" from "anon";

revoke delete on table "public"."assessments" from "authenticated";

revoke insert on table "public"."assessments" from "authenticated";

revoke references on table "public"."assessments" from "authenticated";

revoke select on table "public"."assessments" from "authenticated";

revoke trigger on table "public"."assessments" from "authenticated";

revoke truncate on table "public"."assessments" from "authenticated";

revoke update on table "public"."assessments" from "authenticated";

revoke delete on table "public"."assessments" from "service_role";

revoke insert on table "public"."assessments" from "service_role";

revoke references on table "public"."assessments" from "service_role";

revoke select on table "public"."assessments" from "service_role";

revoke trigger on table "public"."assessments" from "service_role";

revoke truncate on table "public"."assessments" from "service_role";

revoke update on table "public"."assessments" from "service_role";

revoke delete on table "public"."questions" from "anon";

revoke insert on table "public"."questions" from "anon";

revoke references on table "public"."questions" from "anon";

revoke select on table "public"."questions" from "anon";

revoke trigger on table "public"."questions" from "anon";

revoke truncate on table "public"."questions" from "anon";

revoke update on table "public"."questions" from "anon";

revoke delete on table "public"."questions" from "authenticated";

revoke insert on table "public"."questions" from "authenticated";

revoke references on table "public"."questions" from "authenticated";

revoke select on table "public"."questions" from "authenticated";

revoke trigger on table "public"."questions" from "authenticated";

revoke truncate on table "public"."questions" from "authenticated";

revoke update on table "public"."questions" from "authenticated";

revoke delete on table "public"."questions" from "service_role";

revoke insert on table "public"."questions" from "service_role";

revoke references on table "public"."questions" from "service_role";

revoke select on table "public"."questions" from "service_role";

revoke trigger on table "public"."questions" from "service_role";

revoke truncate on table "public"."questions" from "service_role";

revoke update on table "public"."questions" from "service_role";

alter table "public"."assessment_answers" drop constraint "assessment_answers_assessment_id_fkey";

alter table "public"."assessment_answers" drop constraint "assessment_answers_question_id_fkey";

alter table "public"."assessment_answers" drop constraint "unique_answer_per_question";

alter table "public"."assessment_answers" drop constraint "valid_answer";

alter table "public"."questions" drop constraint "valid_options";

drop function if exists "public"."set_question_type"();

alter table "public"."assessment_answers" drop constraint "assessment_answers_pkey";

alter table "public"."assessments" drop constraint "assessments_pkey";

alter table "public"."questions" drop constraint "questions_pkey";

drop index if exists "public"."assessment_answers_pkey";

drop index if exists "public"."assessments_pkey";

drop index if exists "public"."idx_assessment_answers_assessment_id";

drop index if exists "public"."idx_assessment_answers_question_id";

drop index if exists "public"."idx_assessments_device_id";

drop index if exists "public"."idx_assessments_user_id";

drop index if exists "public"."idx_questions_category";

drop index if exists "public"."idx_questions_type";

drop index if exists "public"."questions_pkey";

drop index if exists "public"."unique_answer_per_question";

drop table "public"."assessment_answers";

drop table "public"."assessments";

drop table "public"."questions";

drop type "public"."question_type";


