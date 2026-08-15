#!/usr/bin/env npx tsx
/**
 * validate-reel.ts — Pre-render validation for ki-channel reels.
 *
 * Usage:
 *   npx tsx ki/scripts/validate-reel.ts <composition-id>
 *   npx tsx ki/scripts/validate-reel.ts --all
 *
 * Checks performed:
 *   1. Voiceover file exists on disk
 *   2. Scene timeline is contiguous (no gaps, no overlaps)
 *   3. Last scene endFrame matches durationInFrames
 *   4. All subtitle cues reference valid sceneIds
 *   5. All subtitle cues fall within their scene boundaries
 *   6. Subtitle cues within each scene are contiguous
 *   7. Composition is registered in Root.tsx
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const REELS_DIR = path.join(SRC, 'reels');

// ── Types ──────────────────────────────────────────────────────────────────

interface Scene {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  [key: string]: unknown;
}

interface SubtitleCue {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  text: string;
  [key: string]: unknown;
}

interface ReelConfig {
  compositionId: string;
  durationInFrames: number;
  scenes: Scene[];
  subtitles: SubtitleCue[];
  voiceoverPath?: string;
  reelDir: string;
}

// ── Reel Discovery ─────────────────────────────────────────────────────────

const REEL_MAP: Record<string, () => ReelConfig> = {};

function findReelJsonFiles(): string[] {
  const weekDirs = path.join(ROOT, 'reels');
  const results: string[] = [];
  if (!fs.existsSync(weekDirs)) return results;
  for (const week of fs.readdirSync(weekDirs)) {
    const weekPath = path.join(weekDirs, week);
    if (!fs.statSync(weekPath).isDirectory()) continue;
    for (const reel of fs.readdirSync(weekPath)) {
      const reelJsonPath = path.join(weekPath, reel, '06-projektdateien', 'reel.json');
      if (fs.existsSync(reelJsonPath)) results.push(reelJsonPath);
    }
  }
  return results;
}

function loadReelFromJson(reelJsonPath: string): ReelConfig | null {
  try {
    const raw = JSON.parse(fs.readFileSync(reelJsonPath, 'utf-8'));
    const reelDir = path.dirname(path.dirname(reelJsonPath));
    const subtitlePath = path.join(reelDir, '03-caption', 'subtitle-cues.json');
    let subtitles: SubtitleCue[] = [];
    if (fs.existsSync(subtitlePath)) {
      const subRaw = JSON.parse(fs.readFileSync(subtitlePath, 'utf-8'));
      subtitles = subRaw.cues || [];
    }
    const voiceoverDir = path.join(reelDir, '01-script-audio');
    let voiceoverPath: string | undefined;
    if (fs.existsSync(voiceoverDir)) {
      for (const f of fs.readdirSync(voiceoverDir)) {
        if (f.startsWith('voiceover.')) {
          voiceoverPath = path.join(voiceoverDir, f);
          break;
        }
      }
    }
    // Normalize scenes: some legacy reels use `endFrameExclusive` instead of `endFrame`
    const scenes = (raw.scenes || []).map((s: any) => ({
      ...s,
      endFrame: s.endFrame ?? s.endFrameExclusive ?? undefined,
    }));
    return {
      compositionId: raw.compositionId || raw.format?.compositionId || path.basename(reelDir),
      durationInFrames: raw.format?.durationInFrames ?? raw.durationInFrames ?? 0,
      scenes,
      subtitles,
      voiceoverPath,
      reelDir,
    };
  } catch {
    return null;
  }
}

// ── Validation ─────────────────────────────────────────────────────────────

interface Issue {
  severity: 'ERROR' | 'WARN';
  message: string;
}

function validate(config: ReelConfig): Issue[] {
  const issues: Issue[] = [];
  const { scenes, subtitles, durationInFrames, voiceoverPath, compositionId } = config;

  // 1. Voiceover exists
  if (!voiceoverPath || !fs.existsSync(voiceoverPath)) {
    issues.push({ severity: 'ERROR', message: `Voiceover file not found: ${voiceoverPath || '(none)'}` });
  }

  // 2+3. Scene timeline contiguity
  if (scenes.length === 0) {
    issues.push({ severity: 'ERROR', message: 'No scenes defined' });
  } else {
    if (scenes[0].startFrame !== 0) {
      issues.push({ severity: 'ERROR', message: `First scene starts at ${scenes[0].startFrame}, expected 0` });
    }
    for (let i = 1; i < scenes.length; i++) {
      if (scenes[i].startFrame !== scenes[i - 1].endFrame) {
        issues.push({
          severity: 'ERROR',
          message: `Gap/overlap between scene "${scenes[i - 1].sceneId}" (end=${scenes[i - 1].endFrame}) and "${scenes[i].sceneId}" (start=${scenes[i].startFrame})`,
        });
      }
    }
    const lastEnd = scenes[scenes.length - 1].endFrame;
    if (lastEnd !== durationInFrames) {
      issues.push({
        severity: 'ERROR',
        message: `Last scene ends at ${lastEnd} but durationInFrames is ${durationInFrames}`,
      });
    }
  }

  // 4+5+6. Subtitle cue validation
  const sceneIds = new Set(scenes.map((s) => s.sceneId));
  for (const cue of subtitles) {
    if (!sceneIds.has(cue.sceneId)) {
      issues.push({ severity: 'ERROR', message: `Subtitle cue references unknown sceneId "${cue.sceneId}"` });
      continue;
    }
    const scene = scenes.find((s) => s.sceneId === cue.sceneId)!;
    if (cue.startFrame < scene.startFrame || cue.endFrame > scene.endFrame) {
      issues.push({
        severity: 'ERROR',
        message: `Subtitle cue (${cue.startFrame}-${cue.endFrame}) exceeds scene "${cue.sceneId}" bounds (${scene.startFrame}-${scene.endFrame})`,
      });
    }
  }

  // Check cue contiguity within each scene
  for (const scene of scenes) {
    const sceneCues = subtitles
      .filter((c) => c.sceneId === scene.sceneId)
      .sort((a, b) => a.startFrame - b.startFrame);
    if (sceneCues.length === 0) {
      issues.push({ severity: 'WARN', message: `Scene "${scene.sceneId}" has no subtitle cues` });
      continue;
    }
    for (let i = 1; i < sceneCues.length; i++) {
      if (sceneCues[i].startFrame !== sceneCues[i - 1].endFrame) {
        issues.push({
          severity: 'WARN',
          message: `Subtitle gap in scene "${scene.sceneId}": cue ends ${sceneCues[i - 1].endFrame}, next starts ${sceneCues[i].startFrame}`,
        });
      }
    }
  }

  // 7. Root.tsx registration
  const rootPath = path.join(SRC, 'Root.tsx');
  if (fs.existsSync(rootPath)) {
    const rootContent = fs.readFileSync(rootPath, 'utf-8');
    if (compositionId && !rootContent.includes(compositionId)) {
      issues.push({ severity: 'WARN', message: `Composition "${compositionId}" not found in Root.tsx` });
    }
  }

  return issues;
}

// ── CLI ────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const allReels = findReelJsonFiles();

  if (args.length === 0 || args[0] === '--help') {
    console.log('Usage: npx tsx ki/scripts/validate-reel.ts <composition-id|--all>');
    console.log('\nAvailable reels:');
    for (const r of allReels) {
      const cfg = loadReelFromJson(r);
      if (cfg) console.log(`  ${cfg.compositionId} (${cfg.durationInFrames} frames)`);
    }
    process.exit(0);
  }

  const targets = args[0] === '--all'
    ? allReels
    : allReels.filter((r) => {
        const cfg = loadReelFromJson(r);
        return cfg && (cfg.compositionId === args[0] || cfg.reelDir.includes(args[0]));
      });

  if (targets.length === 0) {
    console.error(`❌ No reel found matching "${args[0]}"`);
    process.exit(1);
  }

  let totalErrors = 0;
  for (const reelPath of targets) {
    const cfg = loadReelFromJson(reelPath);
    if (!cfg) {
      console.error(`❌ Failed to load ${reelPath}`);
      totalErrors++;
      continue;
    }

    console.log(`\n🎬 ${cfg.compositionId} (${cfg.durationInFrames} frames, ${cfg.scenes.length} scenes)`);
    const issues = validate(cfg);
    const errors = issues.filter((i) => i.severity === 'ERROR');
    const warns = issues.filter((i) => i.severity === 'WARN');

    if (issues.length === 0) {
      console.log('   ✅ All checks passed');
    } else {
      for (const e of errors) console.log(`   ❌ ${e.message}`);
      for (const w of warns) console.log(`   ⚠️  ${w.message}`);
    }
    totalErrors += errors.length;
  }

  console.log(`\n${totalErrors === 0 ? '✅ All reels valid' : `❌ ${totalErrors} error(s) found`}`);
  process.exit(totalErrors > 0 ? 1 : 0);
}

main();
