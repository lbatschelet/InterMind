# Questionaire

## Setting up and translating the questionaire

1. Use the 'questionaire_template.xlsx' to create the questionaire and enter basic question data in the 'base' sheet.
2. Create a new sheet for each language you want to support.
3. Enter a first translation (e.g. in English) in the new sheets.
4. The script 'translation_script.py' uses the 'deepl' API to translate the questionaire into the desired languages. You need to sign up at https://www.deepl.com/pro-api?cta=header-pro-api to get an API key. API usage is free to 500'000 characters per month. (Although each file translation counts as at least 50'000 characters)
5. Manage the translation script and enter the desired languages in the 'TARGETS' variable.
6. Run the script.


## Importing the questionaire into the database

1. Use the script 'excel_to_sql.py' to convert the questionaire into a SQL file.
2. Run the script with the following command: (Keep in mind that for this command to directly work, you need to set the working directory to the questionaire folder)

```bash
python excel_to_sql.py questionaire.xlsx -o questionaire.sql
```

3. Import the generated SQL file into the database.


