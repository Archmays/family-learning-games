# Phase 11 National-Standard Resource-Card Expansion Plan

Date: 2026-05-28

## Purpose

Create a national-standard resource-card layer so standards and policy/curriculum-reference documents can be found through the same resource-card indexes as book, magazine, and subscription resources.

## Scope

Included:

- Raw national-standard source documents under `source/national-standard/`.
- Existing Phase 3 standard outcome JSONL files.
- Existing Phase 3 crosswalk and canonical-objective files as linkage sources.

Excluded:

- Textbook processing.
- Magazine article-level processing.
- Subscription processing.
- Book refinement.
- Worksheets, learning plans, diagnostic packs, child-facing activities, and official child progress ledgers.

## Eligible Source Files

- Raw national-standard files found: 383.
- Existing Phase 3 standard outcomes found: 58.

Raw document collections:

- australian-curriculum-v9: 1
- canada-bc-curriculum: 234
- ccss: 7
- china-2022: 17
- ibpyp: 14
- ngss: 23
- ngss-for-Ca: 51
- singapore-moe: 36

## Excluded Files

No raw national-standard file was blocked. Derived crosswalk/canonical files were used for linkage and status updates, not converted into separate resource cards.

## Resource-Card Granularity

- Document-level cards for every raw national-standard source file.
- Outcome-level cards only for existing Phase 3 standard outcomes.
- No new outcome extraction from unstructured PDF/DOC/DOCX files in this phase.

## Validation Method

- Validate `resource-cards-full-national-standard.jsonl` with `code/scripts/validate_schemas.py`.
- Rebuild indexes with `code/scripts/build_indexes.py`.
- Run unittest and pytest.
- Sanity-check source paths, unique resource IDs, quality flags, scope boundaries, and official ledger emptiness.

## Handoff

After Phase 11, national-standard resource-card coverage exists at document level and at existing Phase 3 outcome level. Phase 12 should either run magazine article-level refinement or run a unified resource audit before textbook processing resumes.
