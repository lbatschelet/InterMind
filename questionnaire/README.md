# Questionnaire Workflow


## Step 1: Create the Questionnaire

Copy the provided template file `questionnaire_template.xlsx` to a new file (`survey.xlsx`), either via command line or manually.

**CLI command:**

```bash
cp questionnaire_template.xlsx survey.xlsx
```

Edit `survey.xlsx`:

* In the `base` sheet, define:

  * Question metadata (`id`, `type`, `category`, `sequence_number`)
  * Values for choice questions (`opt_val_1`, `opt_val_2`, ...)
* In the language-specific sheet (e.g. `de`), provide:

  * `question_id`, `title`, `text`
  * Labels for choice questions (`opt_label_1`, `opt_label_2`, ...)
  * Slider labels (`slider_val_1`, `slider_val_2`, ...)

Leave additional language sheets (e.g. `en`, `fr`) empty at this point.

---

## Step 2: Automatically Translate Using DeepL

You need a [DeepL API key](https://www.deepl.com/pro-api?cta=header-pro-api). Set it via an environment variable or pass directly using `--api-key`.

```bash
python translate_excel_deepl.py survey.xlsx --src-lang DE --src-sheet de --targets EN-US FR
```

This creates a new file `survey_translated.xlsx` with translated sheets (`en-us`, `fr`).

> [!IMPORTANT]
> Always manually review translations afterwards.

### CLI Reference for `translate_excel_deepl.py`

| Flag            | Required | Description                                        |
| --------------- | -------- | -------------------------------------------------- |
| `--src-lang`    | ✅       | Source language code (`DE`, `EN`, etc.)            |
| `--targets`     | ✅       | Target language codes (`EN-US`, `FR`, etc.)        |
| `--src-sheet`   |          | Name of source sheet to translate                  |
| `--in-place`    |          | Overwrite original workbook                        |
| `--formality`   |          | Formality: `default`, `more`, `less`, etc.         |
| `--glossary`    |          | Name of glossary (from DeepL UI)                   |
| `--no-validate` |          | Skip validation checks                             |
| `--api-key`     |          | Directly provide DeepL API key (overrides env var) |

> [!TIP]
> For more information, see the [DeepL API documentation](https://developers.deepl.com/docs/api-reference/document/openapi-spec-for-document-translation).

---

## Step 3: Export to SQL

Convert the translated Excel file into SQL seed files:

```bash
python questionnaire/excel_to_sql.py questionnaire/survey_translated.xlsx -d supabase/seeds
```

This creates:

```
supabase/seeds/
  01_base_questions.sql
  02_translations_de.sql
  03_translations_en.sql
  04_translations_fr.sql
```

> [!IMPORTANT]
> Look at the [Supabase documentation](https://supabase.com/docs/guides/database/overview) to learn how to import the SQL files into your database.

> [!TIP]
> I strongly recommend using the [local development](https://supabase.com/docs/guides/local-development/overview) options of supabase as well as the [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)
>
> The Project is fully configured to support this workflow. If you're new to all of this the [CLI documentation](https://supabase.com/docs/guides/local-development/cli/getting-started) is a good place to start.


### CLI Reference for `excel_to_sql.py`

| Flag         | Description                       | Default |
| ------------ | --------------------------------- | ------- |
| `-d / --dir` | Directory for generated SQL files | `.`     |



