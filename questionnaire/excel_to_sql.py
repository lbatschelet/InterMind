#!/usr/bin/env python3
"""
Convert an Excel questionnaire to pretty SQL files.

Outputs
-------
    01_base_questions.sql
    02_translations_<lang>.sql  … one per language sheet
"""

import argparse
import datetime
import json
import re
import textwrap
from pathlib import Path

import pandas as pd
import sqlparse

MAX_OPTS = 20
SLIDER_MIN, SLIDER_MAX = 2, 3
LANG_RE = re.compile(r"^[a-z]{2}(?:-[a-z]{2})?$", re.I)


# ─────────────────────────── helper functions ──────────────────────────────
def normalize(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    out.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]
    return out


def truthy(val) -> bool:
    return str(val).strip().lower() in {"1", "true", "yes", "ja"}


def sql_literal(text: str) -> str:
    """Return a safely single-quoted literal — escape ' and \\."""
    return "'" + text.replace("\\", "\\\\").replace("'", "''") + "'"


def header(src: Path) -> str:
    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return textwrap.dedent(
        f"""\
        -- *******************************************************
        --  Auto-generated SQL from Excel questionnaire
        --  Source file : {src.name}
        --  Generated   : {ts}
        --  Script      : excel_to_sql.py
        -- *******************************************************

        """
    )


def pretty(sql: str) -> str:
    return sqlparse.format(sql, keyword_case="upper", reindent=True, wrap_after=120)


def option_values(row: pd.Series) -> list[str]:
    return [
        str(row[f"opt_val_{i}"]).strip()
        for i in range(1, MAX_OPTS + 1)
        if f"opt_val_{i}" in row and pd.notna(row[f"opt_val_{i}"]) and str(row[f"opt_val_{i}"]).strip()
    ]


def label_values(row: pd.Series, prefix: str, limit: int) -> list[str]:
    return [
        str(row[f"{prefix}{i}"]).strip()
        for i in range(1, limit + 1)
        if f"{prefix}{i}" in row and pd.notna(row[f"{prefix}{i}"]) and str(row[f"{prefix}{i}"]).strip()
    ]


# ─────────────────────────── main conversion ───────────────────────────────
def convert(xlsx: Path, out_dir: Path) -> None:
    xl = pd.ExcelFile(xlsx)
    if "base" not in xl.sheet_names:
        raise ValueError("Sheet 'base' is missing.")

    base = normalize(xl.parse("base"))
    if "question_id" in base.columns and "id" not in base.columns:
        base.rename(columns={"question_id": "id"}, inplace=True)

    # ------------------------- questions ----------------------------------
    q_rows = []
    for _, row in base.iterrows():
        q_id, q_type = row["id"], row["type"]

        struct = {}
        if truthy(row.get("show_once", "")):
            struct["showOnce"] = True
        if q_type == "single_choice":
            struct["autoAdvance"] = True
        if pd.notna(row.get("action")):
            struct["action"] = str(row["action"])
        if pd.notna(row.get("button_text")):
            struct["buttonText"] = str(row["button_text"])
        if q_type in {"single_choice", "multiple_choice"}:
            values = option_values(row)
            if not values:
                raise ValueError(f"Choice question '{q_id}' has no opt_val_n values.")
            struct["options"] = [{"value": v} for v in values]

        struct_sql = "NULL" if not struct else sql_literal(json.dumps(struct, ensure_ascii=False))
        img_sql = "NULL" if pd.isna(row.get("image_source")) else sql_literal(str(row["image_source"]))

        q_rows.append(
            f"    ('{q_id}', '{q_type}', '{row['category']}', {int(row['sequence_number'])}, {img_sql}, {struct_sql})"
        )

    (out_dir / "01_base_questions.sql").write_text(
        pretty(
            header(xlsx)
            + "INSERT INTO questions\n"
            + "    (id, type, category, sequence_number, image_source, options_structure)\n"
            + "VALUES\n"
            + ",\n".join(q_rows)
            + ";\n"
        ),
        encoding="utf-8",
    )
    print("✓ 01_base_questions.sql")

    # ------------------------- translations --------------------------------
    lang_sheets = sorted(
        [s for s in xl.sheet_names if LANG_RE.match(s) and s.lower() != "base"],
        key=str.lower,
    )

    idx = 2
    for sheet in lang_sheets:
        lang = sheet.lower()
        df = normalize(xl.parse(sheet))

        rows = []
        uses_options_col = False

        # First pass: decide per row
        per_row_opts: list[str] = []

        for _, tr in df.iterrows():
            q_id = tr["question_id"]
            base_row = base.loc[base["id"] == q_id]
            if base_row.empty:
                raise ValueError(f"Sheet '{sheet}' references unknown question_id '{q_id}'.")
            base_row = base_row.iloc[0]
            q_type = base_row["type"]

            content = None
            if q_type in {"single_choice", "multiple_choice"}:
                labels = label_values(tr, "opt_label_", MAX_OPTS)
                values = option_values(base_row)
                if len(labels) != len(values):
                    raise ValueError(
                        f"Sheet '{sheet}', question '{q_id}': {len(labels)} labels vs {len(values)} values."
                    )
                content = {"options": [{"value": v, "label": l} for v, l in zip(values, labels)]}
            elif q_type == "slider":
                slider_labels = [v for v in label_values(tr, "slider_val_", SLIDER_MAX) if v]
                if not (SLIDER_MIN <= len(slider_labels) <= SLIDER_MAX):
                    raise ValueError(
                        f"Slider '{q_id}' in sheet '{sheet}' needs {SLIDER_MIN}-{SLIDER_MAX} labels."
                    )
                content = {"values": slider_labels}

            per_row_opts.append(content)
            if content:
                uses_options_col = True

        # Second pass: build rows (now we know if column is present)
        for tr, content in zip(df.itertuples(index=False), per_row_opts):
            q_id = tr.question_id
            title_sql = sql_literal(str(tr.title))
            text_sql = sql_literal(str(tr.text))

            if content:
                opt_sql = ", " + sql_literal(json.dumps(content, ensure_ascii=False))
            else:
                opt_sql = ", NULL" if uses_options_col else ""

            rows.append(f"    ('{q_id}', '{lang}', {title_sql}, {text_sql}{opt_sql})")

        col_block = "(question_id, language, title, text" + (", options_content" if uses_options_col else "") + ")"
        file_sql = (
            header(xlsx)
            + "INSERT INTO translations\n    "
            + col_block
            + "\nVALUES\n"
            + ",\n".join(rows)
            + ";\n"
        )

        fname = f"{idx:02d}_translations_{lang}.sql"
        (out_dir / fname).write_text(pretty(file_sql), encoding="utf-8")
        print("✓", fname)
        idx += 1


# ─────────────────────────── CLI ───────────────────────────────────────────
if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Convert an Excel survey to SQL seed files.")
    ap.add_argument("xlsx", help="Path to the .xlsx file")
    ap.add_argument("-d", "--dir", default=".", help="Output directory (default: current folder)")
    args = ap.parse_args()

    out_path = Path(args.dir).resolve()
    out_path.mkdir(parents=True, exist_ok=True)
    convert(Path(args.xlsx).resolve(), out_path)
    print("Done. Files written to", out_path)
