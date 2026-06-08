# Phase 11 National-Standard Card Granularity Note

Date: 2026-05-28

## Decision

Use two controlled granularities:

1. Document-level cards for all raw national-standard source files.
2. Outcome-level cards only for standard outcomes already extracted during Phase 3.

## Why Not Full Outcome Extraction Now

The raw collection includes PDF, DOC, DOCX, TXT, and XLSX files across multiple countries, subjects, stages, and formats. Many files are binary office/PDF documents and have not been text-normalized into consistent outcome tables. Creating thousands of outcome-level cards directly from filenames or unreviewed source structure would create weak, unreliable links.

## What This Enables

- Full source discovery by document, collection, subject, and quality flag.
- Direct lookup of existing Phase 3 standard outcomes through resource cards.
- A clear boundary between source availability and true standards crosswalk expansion.

## Future Deepening Rule

Future phases may add outcome-level cards for Science, Chinese, Computing, or other subjects only after their standards are deliberately extracted into standard outcome records with source locations and summary-only copyright handling.
