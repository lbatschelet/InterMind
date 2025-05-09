from pathlib import Path
import deepl, openpyxl, tempfile

API_KEY = "op://Personal/DeepL API Key/credential"
SRC_WB  = Path("InterMind/questionaire/Fragenkatalog.xlsx")   # enthält base + de
TARGETS = {"fr": "FR"}

client = deepl.Translator(API_KEY)

def translate_and_merge(target_lang_code, deepl_code):
    tmp_out = SRC_WB.with_name(f"{SRC_WB.stem}_{target_lang_code}.xlsx")

    # 1) Dokument übersetzen
    client.translate_document_from_filepath(
        str(SRC_WB), str(tmp_out),
        source_lang="DE", target_lang=deepl_code
    )

    # 2) Übersetztes Workbook öffnen
    wb_trans = openpyxl.load_workbook(tmp_out, data_only=True)
    print("DeepL-Sheets:", wb_trans.sheetnames)

    # 3) Alle Blätter außer 'base' kopieren
    wb_base = openpyxl.load_workbook(SRC_WB)
    for sh in wb_trans.sheetnames:
        if sh.lower() == "base":
            continue
        # Zielname: target_lang_code
        if target_lang_code in wb_base.sheetnames:
            del wb_base[target_lang_code]
        wb_base.copy_worksheet(wb_trans[sh]).title = target_lang_code
        break   # nur das erste Nicht-base-Sheet nehmen

    wb_base.save(SRC_WB)
    tmp_out.unlink()
    print(f"→ Sheet '{target_lang_code}' ergänzt")

for code, ddl in TARGETS.items():
    translate_and_merge(code, ddl)