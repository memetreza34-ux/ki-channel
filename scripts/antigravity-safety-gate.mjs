#!/usr/bin/env node
import process from 'node:process';

let raw = '';
for await (const chunk of process.stdin) raw += chunk;

const respond = (decision, reason) => {
  process.stdout.write(`${JSON.stringify({decision, ...(reason ? {reason} : {})})}\n`);
};

let input;
try {
  input = raw.trim() ? JSON.parse(raw) : {};
} catch {
  respond('force_ask', 'Antigravity safety gate could not parse hook input.');
  process.exit(0);
}

const tool = String(input?.toolCall?.name || '');
const args = input?.toolCall?.args || {};
const writeTools = new Set(['write_to_file', 'replace_file_content', 'multi_replace_file_content']);

if (writeTools.has(tool)) {
  const target = String(args.TargetFile || '').replaceAll('\\', '/');
  if (/\/01-script-audio\/voiceover\.(?:mp3|wav|m4a|aac|flac|ogg)$/i.test(target) || /(?:^|\/)01-script-audio\/voiceover\.(?:mp3|wav|m4a|aac|flac|ogg)$/i.test(target)) {
    respond('deny', 'Production voiceover is user-owned Phase 2 input. Antigravity must never create or replace it.');
    process.exit(0);
  }
  respond('allow', 'Workspace text edit allowed; post-edit repository guards will run afterwards.');
  process.exit(0);
}

if (tool !== 'run_command') {
  respond('allow');
  process.exit(0);
}

const command = String(args.CommandLine || '').trim();
const lower = command.toLowerCase();

const destructive = [
  /\brm\s+-rf\b/,
  /\bgit\s+reset\s+--hard\b/,
  /\bgit\s+clean\s+-[^\n]*f/,
  /\bgit\s+branch\s+-d\b/,
  /\bgit\s+branch\s+-D\b/,
  /\bsudo\b/,
];
if (destructive.some((pattern) => pattern.test(command))) {
  respond('force_ask', 'Destructive or elevated command requires explicit user review.');
  process.exit(0);
}

const mainBranchMutation = [
  /\bgit\s+(?:checkout|switch)\s+main\b/i,
  /\bgit\s+push\b[^\n]*(?:\bmain\b|HEAD:main)/i,
  /\bgh\s+pr\s+(?:merge|ready)\b/i,
  /\bgit\s+(?:merge|rebase)\b/i,
];
if (mainBranchMutation.some((pattern) => pattern.test(command))) {
  respond('force_ask', 'Branch/merge/release state mutation requires explicit user review.');
  process.exit(0);
}

const remoteVoiceAttempt = /\b(?:curl|wget|aria2c)\b/i.test(command)
  && /(?:voiceover|01-script-audio|aidocmaker)/i.test(command);
if (remoteVoiceAttempt) {
  respond('deny', 'Remote production voiceover download is forbidden. The user must place the complete local voiceover file.');
  process.exit(0);
}

const ttsAttempt = /(?:edge-tts|gtts(?:-cli)?|\bespeak\b|\bpiper\b[^\n]*(?:output|wav)|text[- ]?to[- ]?speech|openai[^\n]*audio[^\n]*speech|elevenlabs)/i.test(lower);
if (ttsAttempt) {
  respond('deny', 'Production TTS generation is forbidden in this repository; Phase 2 voiceover is created only by the user.');
  process.exit(0);
}

const safePatterns = [
  /^npm\s+(?:run\b|test\b)/i,
  /^npm\s+install\s+--package-lock=false\b/i,
  /^node\s+(?:scripts\/|ki\/scripts\/)/i,
  /^npx\s+(?:remotion\b|-y\s+remotion-bits\b)/i,
  /^git\s+(?:status|diff|log|show|fetch|pull|branch|rev-parse|ls-files|add|commit)\b/i,
  /^ffprobe\b/i,
  /^ffmpeg\b/i,
  /^(?:find|ls|cat|pwd|rg|grep|mkdir)\b/i,
];

if (safePatterns.some((pattern) => pattern.test(command))) {
  respond('allow', 'Command matches the KI-channel sandbox-safe production allowlist.');
  process.exit(0);
}

respond('ask', 'Command is outside the focused KI-channel auto-allowlist and should be reviewed.');
