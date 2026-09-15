---
description: Run an optional independent Antigravity SDK multimodal second-opinion review on the exact mastered reel MP4 without replacing deterministic gates or the required human 1x review.
---

# /multimodal-review-ki-reel <mastered-mp4>

This is an **optional additional QA layer**, not a release authority.

## Preconditions

1. Use only the exact mastered MP4 intended for final review.
2. Compute/record its SHA256 through the normal repository review path.
3. The local environment must have:
   - Python 3;
   - `GEMINI_API_KEY`;
   - optional SDK dependencies installed:
     `python3 -m pip install 'google-antigravity>=0.1.12,<0.2' pydantic`
4. If these optional requirements are unavailable, report `OPTIONAL_MULTIMODAL_REVIEW_UNAVAILABLE` and continue the normal deterministic/human review path.

## Run

```bash
python3 scripts/antigravity_multimodal_reel_review.py <mastered-mp4>
```

The SDK reviewer receives the local video file directly as multimodal input and has all agent tools denied for this task. It returns a Pydantic-validated structured review under:

`out/antigravity-multimodal-reviews/`

## Use the result

Treat findings as an independent second opinion for:

- story flow;
- visual reaction density;
- long/static presentation-like stretches;
- mobile/caption readability;
- camera/transition purpose;
- proof visual quality;
- voice/SFX balance when perceptible;
- exact time ranges that deserve human re-check.

If it reports a blocking issue, manually verify the timestamp in the exact mastered MP4 before changing production source.

## Hard rule

A model review can be wrong. It never sets the repository's final 1x review fields to PASS automatically and never replaces the user's/real visual-listening review of the exact mastered MP4.
