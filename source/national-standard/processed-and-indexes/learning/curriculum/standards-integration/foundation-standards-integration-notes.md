# Foundation Standards Integration Notes

## Pilot Design

This pass creates a narrow English + Maths Foundation crosswalk. It does not attempt to unify every national standard in the repository.

The selected sources were chosen because they contribute different strengths:

- China 2022: local compulsory-education goals, early English guidance, first-stage mathematics goals, and learning-habit expectations.
- Singapore MOE: strong lower-primary English learning areas and a clear P1 mathematics syllabus that aligns well with MPH Maths 1A.
- IB PYP: phase-based, inquiry-friendly, observable developmental language and mathematics continuums.

## Integration Method

1. Start from already processed textbook objectives:
   - CPP Foundation English objectives
   - MPH Maths 1A objectives
2. Extract only relevant Foundation/early primary standard outcomes.
3. Summarize outcomes rather than copying standards text.
4. Map textbook objectives to standard outcomes with alignment strength.
5. Build family canonical objectives that are:
   - observable
   - small enough for family use
   - useful for future progress ledger evidence
   - cautious about support level and context

## Alignment Strength

- `strong`: textbook objective and standard outcome share clear content and observable behaviour.
- `moderate`: useful alignment, but grade band, scope, or evidence type differs.
- `weak`: adjacent or supporting relationship only.
- `uncertain`: not enough source evidence to claim alignment.

## Family Canonical Objective Rules

- A canonical objective is not a standard copy.
- A canonical objective is not a claim about Xiaoyue.
- A canonical objective must support future evidence collection.
- Each objective lists examples of evidence and non-evidence.
- Progress ledger entries still require real observation.

## Why Existing Objectives Were Not Modified

`language-foundation-objectives.yaml` and `math-foundation-objectives.yaml` were left structurally unchanged in this pass to avoid destabilizing the textbook data layer. The new crosswalk file provides the relationship between existing objective IDs, selected standards, and family canonical objectives.

A future pass may add non-breaking fields such as `related_canonical_objective_id` and `related_standard_outcomes` to those files after the pilot structure is reviewed.

## Copyright Boundary

All derived entries are summaries. No full standard tables, long passages, or page-level reproductions were copied. Source locations are kept so a future reviewer can return to the raw source if needed.
