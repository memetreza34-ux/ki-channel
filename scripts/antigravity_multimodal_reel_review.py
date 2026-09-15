#!/usr/bin/env python3
"""Optional multimodal second-opinion review for a final KI-channel MP4.

This does not replace deterministic validators or the required human 1x review.
Requires the optional Google Antigravity SDK and GEMINI_API_KEY.
"""

from __future__ import annotations

import argparse
import asyncio
import hashlib
import json
import os
from pathlib import Path
from typing import Literal

try:
    from pydantic import BaseModel, Field
    from google.antigravity import Agent, LocalAgentConfig
    from google.antigravity.hooks.policy import deny
    from google.antigravity.types import from_file
except ImportError as exc:
    raise SystemExit(
        "Optional Antigravity SDK review is unavailable. Install with: "
        "python3 -m pip install 'google-antigravity>=0.1.12,<0.2' pydantic\n"
        f"Import error: {exc}"
    )


class TimedIssue(BaseModel):
    start_seconds: float | None = None
    end_seconds: float | None = None
    category: str
    severity: Literal["LOW", "MEDIUM", "HIGH", "BLOCKING"]
    observation: str
    recommended_action: str


class Dimension(BaseModel):
    status: Literal["PASS", "FAIL", "NOT_ENOUGH_EVIDENCE"]
    score_1_to_10: int = Field(ge=1, le=10)
    evidence: str


class ReelMultimodalReview(BaseModel):
    overall_status: Literal["PASS", "FAIL", "NEEDS_HUMAN_REVIEW"]
    story_flow: Dimension
    visual_reaction_density: Dimension
    mobile_readability: Dimension
    caption_readability_and_sync: Dimension
    camera_and_transition_purpose: Dimension
    proof_visual_quality: Dimension
    voice_and_sfx_balance: Dimension
    static_state_risk: Dimension
    strengths: list[str]
    timed_issues: list[TimedIssue]
    blocking_issues: list[str]
    human_1x_review_focus: list[str]
    summary: str


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


async def review(video_path: Path, output_dir: Path) -> Path:
    if not os.getenv("GEMINI_API_KEY"):
        raise SystemExit(
            "GEMINI_API_KEY is not set. This optional SDK review will not run. "
            "Do not block the normal local Remotion/repository review path because of this optional layer."
        )

    file_sha = sha256_file(video_path)
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / f"{video_path.stem}_{file_sha[:12]}_multimodal-review.json"

    system_instructions = (
        "You are an independent multimodal QA reviewer for a German faceless AI social reel. "
        "Evaluate the actual attached MP4, not source code. The target is a clean premium narrative reel, "
        "not a static slide deck. Be strict about story progression, meaningful visual reactions, long static states, "
        "mobile readability, caption timing/readability, camera/transition purpose, proof visuals and voice-over-SFX priority. "
        "Do not invent timestamps or claim audio/caption evidence you cannot perceive. If evidence is insufficient, use "
        "NOT_ENOUGH_EVIDENCE or NEEDS_HUMAN_REVIEW. The required human 1x review remains authoritative."
    )

    # No filesystem/shell/web tools are needed for this review. Deny tool use so the SDK acts only on the supplied MP4.
    config = LocalAgentConfig(
        system_instructions=system_instructions,
        response_schema=ReelMultimodalReview,
        policies=[deny("*")],
    )

    prompt = [
        (
            "Review this exact mastered social reel at normal playback semantics. "
            f"File SHA256: {file_sha}. "
            "Look for stretches that feel like a presentation instead of a progressing story. "
            "When possible, attach approximate time ranges to concrete issues. "
            "A visual element changing color slightly is not automatically a meaningful new beat. "
            "Judge whether every important spoken idea receives a useful visual response and whether sound supports visible events without masking the voice."
        ),
        from_file(str(video_path)),
    ]

    async with Agent(config) as agent:
        response = await agent.chat(prompt)
        data = await response.structured_output()

    envelope = {
        "version": 1,
        "reviewType": "OPTIONAL_ANTIGRAVITY_SDK_MULTIMODAL_SECOND_OPINION",
        "video": str(video_path),
        "sha256": file_sha,
        "human1xReviewStillRequired": True,
        "result": data,
    }
    output_path.write_text(json.dumps(envelope, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return output_path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("video", help="Path to the exact mastered MP4 to review")
    parser.add_argument("--output-dir", default="out/antigravity-multimodal-reviews")
    args = parser.parse_args()

    video_path = Path(args.video).expanduser().resolve()
    if not video_path.is_file():
        raise SystemExit(f"Video not found: {video_path}")
    if video_path.suffix.lower() not in {".mp4", ".mov", ".webm", ".m4v"}:
        raise SystemExit(f"Expected a video file, got: {video_path.suffix}")

    output_path = asyncio.run(review(video_path, Path(args.output_dir).expanduser().resolve()))
    print(f"ANTIGRAVITY MULTIMODAL REVIEW: {output_path}")
    print("This is a second opinion only. The exact human 1x visual/listening review is still required.")


if __name__ == "__main__":
    main()
