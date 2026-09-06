import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, rm} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

const has = (cmd) => {
  const r = spawnSync(cmd, ['-version'], {encoding:'utf8'});
  return !r.error && r.status === 0;
};

test('master gate rejects static low-bitrate render with trailing silence', {skip: !(has('ffmpeg') && has('ffprobe'))}, async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'longform-master-gate-'));
  try {
    const bad = path.join(dir, 'bad.mp4');
    const render = spawnSync('ffmpeg', [
      '-hide_banner','-loglevel','error','-y',
      '-f','lavfi','-i','color=c=white:s=1920x1080:r=30:d=6',
      '-f','lavfi','-i','sine=frequency=1000:duration=2:sample_rate=48000',
      '-filter_complex','[1:a]apad=pad_dur=4[a]',
      '-map','0:v:0','-map','[a]',
      '-c:v','libx264','-b:v','120k','-pix_fmt','yuv420p',
      '-c:a','aac','-ar','48000','-ac','2','-t','6', bad,
    ], {encoding:'utf8', maxBuffer:32*1024*1024});
    assert.equal(render.status, 0, render.stderr || render.stdout);
    const gate = spawnSync(process.execPath, [path.resolve('scripts','check-ki-longform-master.mjs'), bad], {encoding:'utf8', maxBuffer:64*1024*1024});
    assert.notEqual(gate.status, 0, 'bad fixture must be rejected');
    const text = `${gate.stdout || ''}\n${gate.stderr || ''}`;
    assert.match(text, /video bitrate|freeze\/static|trailing silence/i);
  } finally {
    await rm(dir, {recursive:true, force:true});
  }
});
