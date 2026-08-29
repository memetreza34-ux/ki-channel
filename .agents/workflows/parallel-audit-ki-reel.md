---
description: Run independent read-only KI-channel audits in parallel so facts, retention/story structure, motion design, dependency compatibility and existing visual evidence are checked without polluting or modifying the main working tree.
---

# /parallel-audit-ki-reel <reel-package-dir>

Use this before a major implementation pass or when a reel feels wrong but the exact cause is unclear.

## Parallel subagents

Invoke concurrently with workspace `inherit`:

1. `ki-fact-researcher`
   - verify current factual claims and official source proof;
   - return only evidence/corrections.

2. `ki-retention-story-auditor`
   - inspect hook, progression, proof, consequence, payoff, visual-grammar repetition and likely drop-off stretches;
   - reference exact scene/beat IDs;
   - never rewrite approved text silently.

3. `ki-motion-researcher`
   - map spoken/story beats to stronger motion patterns;
   - inspect shared StoryMotion/StoryMedia stack and relevant Remotion APIs;
   - return implementation options without editing.

4. `ki-dependency-auditor`
   - inspect package compatibility, local pins and current official requirements;
   - return risks without upgrading anything.

5. `ki-visual-qa-auditor` when real render/still/master artifacts already exist
   - audit actual visual evidence;
   - include story-beat still/pixel-delta findings when available;
   - do not infer PASS from source.

## Parent synthesis

After all applicable agents return, produce a single ordered table:

| Priority | Area | Finding | Evidence | Action | Requires user? |
|---|---|---|---|---|---|

Priority order:

1. factual correctness;
2. broken runtime/compatibility;
3. retention/story/pacing;
4. readability/visual proof;
5. motion polish;
6. optional enhancement.

Do not let any read-only audit agent modify source. Do not spawn multiple write agents until the parent has chosen one implementation plan.
