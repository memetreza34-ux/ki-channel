import {existsSync} from 'node:fs';
import {readFile, readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import path from 'node:path';

export const safeCompositionId = (value) => String(value || '').replace(/[^A-Za-z0-9._-]+/g,'-');

export const sha256File = async (file) => createHash('sha256').update(await readFile(file)).digest('hex');

export const sha256Directory = async (dir) => {
  const root = path.resolve(dir);
  if (!existsSync(root)) throw new Error(`source directory missing: ${root}`);
  const files = [];
  const walk = async (current) => {
    for (const entry of await readdir(current,{withFileTypes:true})) {
      const full = path.join(current,entry.name);
      if (entry.isDirectory()) await walk(full);
      else files.push(full);
    }
  };
  await walk(root);
  files.sort((a,b)=>a.localeCompare(b,'en'));
  const hash = createHash('sha256');
  for (const file of files) {
    const relative = path.relative(root,file).split(path.sep).join('/');
    hash.update(relative);
    hash.update('\0');
    hash.update(await readFile(file));
    hash.update('\0');
  }
  return hash.digest('hex');
};

export const getGitState = () => {
  const head = spawnSync('git',['rev-parse','HEAD'],{encoding:'utf8'});
  if (head.error || head.status !== 0) throw new Error('git rev-parse HEAD failed.');
  const status = spawnSync('git',['status','--porcelain'],{encoding:'utf8'});
  if (status.error || status.status !== 0) throw new Error('git status --porcelain failed.');
  return {commitSha: head.stdout.trim(), dirty: Boolean(status.stdout.trim()), porcelain: status.stdout.trim()};
};

export const resolveSourceDir = async (reelDir,reel) => {
  const isolationPath = path.join(reelDir,'06-projektdateien','source-isolation.json');
  if (existsSync(isolationPath)) {
    const isolation = JSON.parse(await readFile(isolationPath,'utf8'));
    if (isolation?.sourceDir) return String(isolation.sourceDir);
  }
  if (reel?.sourceDir) return String(reel.sourceDir);
  return null;
};

export const runtimeAudioPath = (compositionId) => path.resolve('public','runtime-audio',`${safeCompositionId(compositionId)}.wav`);
export const renderLockPath = (compositionId) => path.resolve('public','runtime-audio',`${safeCompositionId(compositionId)}.render-lock.json`);
