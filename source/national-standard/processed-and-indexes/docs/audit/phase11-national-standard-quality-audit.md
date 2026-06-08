# Phase 11 National-Standard Quality Audit

Date: 2026-05-28

## Checks

| Check | Result |
| --- | --- |
| Duplicate resource_id | 0 |
| Unresolved source paths | 0 |
| Missing quality flags | 0 |
| Raw files with OCR/conversion risk flag | 153 |
| Unclear source status flags | 1 |
| Unsupported or invented standard outcome links | 0 |
| Cards without not_child_facing readiness | 0 |
| Outcome cards with canonical links | 34 |
| Outcome cards without canonical links | 24 |
| Document cards | 383 |
| Outcome cards | 58 |

## Coverage Notes

- Every raw national-standard source file is represented by a document-level card.
- Outcome-level coverage is intentionally limited to existing Phase 3 standard outcome records.
- Many document cards have weak alignment because they are broad policy/curriculum references, not child-facing resources.
- Age-band mapping is inferred from filenames and paths; unknown or broad documents are flagged conservatively.

## Risks

- Some PDF/DOC files may need OCR or conversion before deeper outcome extraction.
- Existing Phase 3 outcomes cover English and Maths only; other subjects remain document-level.
- Raw file titles may not capture full subject/stage detail.
- National standards must not be used as child progress evidence.
