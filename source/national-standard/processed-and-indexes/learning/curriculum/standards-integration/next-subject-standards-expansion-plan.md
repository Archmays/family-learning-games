# Next Subject Standards Expansion Plan

Date: 2026-05-27

## Scope

This is a planning document only. Phase 3 completed full standards crosswalk expansion for English L1 and Maths lower-primary. It did not perform full Science, Chinese, Computing, AI, or information-literacy extraction.

## 1. Science Standards Expansion

Recommended order:

1. Pilot crosswalk for lower-primary inquiry practices and life/physical/earth observation.
2. Add source outcomes only after the first science textbook data layer is processed or a concrete family science objective is selected.
3. Build canonical objectives around observable science practices: observe, ask, compare, classify, model, test, explain with evidence, and care for living/nonliving systems.

Candidate standards sources:

- `source/national-standard/singapore-moe/Primary Science Syllabus 2023.pdf`
- `source/national-standard/china-2022/10.义务教育科学课程标准（2022年版）.docx`
- `source/national-standard/ibpyp/PYP_subject_continuums_science_en.pdf`
- `source/national-standard/ngss-for-Ca/Chapter 3 Kindergarten Through Grade Two.doc`
- `source/national-standard/ngss-for-Ca/GK-5 Standards/` files if a California NGSS comparison is needed

Textbook prerequisite:

- Prefer processing one bounded lower-primary science textbook layer before full textbook-to-standard crosswalk.
- If no textbook is processed, do only a pilot standards-to-family-practices map.

Learning-map prerequisite:

- Add `learning/curriculum/learning-map/science-lower-primary-objectives.yaml` before any full crosswalk.

Recommended scope:

- Start with a pilot, not a full crosswalk.

## 2. Chinese / Literacy Standards Expansion

Recommended order:

1. Clarify whether the subject is Chinese language literacy, bilingual literacy, home-language development, or cross-lingual reading support.
2. Build a small lower-primary Chinese/literacy objective map before extracting standards.
3. Pilot oral language, character/word recognition, reading interest, retelling, copying/writing readiness, and cultural-language routines.

Candidate standards sources:

- `source/national-standard/china-2022/3.义务教育语文课程标准（2022年版）.docx`
- `source/national-standard/singapore-moe/CL Syllabus Pri 2024.pdf`
- `source/national-standard/ibpyp/PYP_subject_continuums_language_zh.pdf`
- `source/national-standard/ibpyp/PYP_subject_continuums_language_en.pdf` for bilingual method comparison only

Textbook prerequisite:

- A corresponding Chinese textbook or graded-reading data layer should be processed before a full textbook-to-standard crosswalk.
- Without a textbook, create only a standards pilot and family-observation objective draft.

Learning-map prerequisite:

- Add a Chinese/literacy learning-map objective file after clarifying age band and language role.

Recommended scope:

- Start with a pilot, not a full crosswalk.

## 3. Computing / AI / Information Literacy Standards Expansion

Recommended order:

1. Separate computing concepts from AI/information literacy and digital citizenship.
2. Start with unplugged and family-observable objectives: sequence, pattern, instructions, debugging language, safe tool use, media judgement, and asking what a tool can or cannot know.
3. Use AI-era principles already in the repo as a family design lens, not as a formal standard.

Candidate standards sources:

- `source/national-standard/china-2022/14.义务教育信息科技课程标准（2022年版）.docx`
- `source/national-standard/singapore-moe/2026 G1 Computing Syllabus.pdf`
- `source/national-standard/singapore-moe/2026 G2 Computing Syllabus.pdf`
- `source/national-standard/canada-bc-learning/curriculum/Applied Design, Skills, and Technologies/en_ADST_k-9_curricular_competencies.pdf`
- `source/national-standard/canada-bc-learning/curriculum/Applied Design, Skills, and Technologies/en_ADST_k-9_content.pdf`
- `learning/curriculum/learning-map/ai-era-education-principles.md`

Textbook prerequisite:

- Not strictly required for a small pilot because computing and AI literacy can start from family routines and unplugged activities.
- A textbook or course layer is needed before any full crosswalk with lesson progression.

Learning-map prerequisite:

- Add `learning/curriculum/learning-map/computing-ai-literacy-lower-primary-objectives.yaml` before full integration.

Recommended scope:

- Start with a pilot. Avoid a full coding curriculum until family goals and age band are confirmed.

## 4. Cross-Subject Structure To Reuse

Future subjects should reuse the Phase 3 structure:

- `<subject>-standard-outcomes.jsonl`
- `<subject>-standard-crosswalk.csv`
- `<subject>-canonical-objectives.yaml`
- `<subject>-standards-index.md`
- `docs/audit/<subject>-standards-crosswalk-report.md`

Required boundaries:

- Use summary-only standard outcomes.
- Keep source IDs and source locations.
- Keep canonical objectives observable.
- Separate `evidence_examples` from `not_evidence`.
- Do not treat standards coverage, textbook coverage, or generated output as progress evidence.
- Do not write official progress ledgers without real observation records.
