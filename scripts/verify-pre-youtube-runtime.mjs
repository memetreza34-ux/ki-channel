#!/usr/bin/env node
import {existsSync, readFileSync, statSync, mkdirSync, writeFileSync} from 'node:fs';
import {execFileSync, spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
import process from 'node:process';

const reportDir = resolve('out','pre-youtube-runtime');
const reportPath = resolve(reportDir,'summary.json');
const startedAt = Date.now();
const fail = (message, code = 1) => {
  mkdirSync(reportDir,{recursive:true});
  writeFileSync(reportPath,`${JSON.stringify({status:'failed',message,node:process.version,completedAt:new Date().toISOString()},null,2)}\n`,'utf8');
  console.error(`PRE-YOUTUBE RUNTIME VERIFY FAILED: ${message}`);
  process.exit(code);
};

const nodeMajor = Number(process.versions.node.split('.')[0]);
if (nodeMajor !== 24) fail(`Node 24 LTS ist Pflicht, aktiv ist ${process.version}.`);

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npmVersionRun = spawnSync(npm,['--version'],{encoding:'utf8'});
if (npmVersionRun.error || npmVersionRun.status !== 0) fail('npm ist nicht verfügbar.');
const npmVersion = String(npmVersionRun.stdout || '').trim();
if (Number(npmVersion.split('.')[0]) !== 11) fail(`npm 11 ist Pflicht, aktiv ist ${npmVersion}.`);

if (!existsSync('package-lock.json') || !statSync('package-lock.json').isFile() || statSync('package-lock.json').size < 100) {
  fail('package-lock.json fehlt. Zuerst npm run runtime:bootstrap ausführen.');
}
try {
  execFileSync('git',['ls-files','--error-unmatch','package-lock.json'],{stdio:'ignore'});
} catch {
  fail('package-lock.json ist nicht committed. Bootstrap-Lockfile zuerst committen.');
}

const startHead = execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const trackedStatus = execFileSync('git',['status','--porcelain','--untracked-files=no'],{encoding:'utf8'}).trim();
if (trackedStatus) fail(`Tracked Worktree ist nicht sauber:\n${trackedStatus}`);

const run = (label, command, args) => {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command,args,{stdio:'inherit',env:process.env});
  if (result.error || result.status !== 0) fail(`${label} fehlgeschlagen (${result.status ?? 'unknown'}).`, result.status ?? 1);
  const head = execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
  if (head !== startHead) fail(`HEAD änderte sich während ${label}: ${startHead} -> ${head}.`);
};

run('npm ci', npm, ['ci','--no-audit','--no-fund']);
run('YouTube readiness', process.execPath, ['scripts/run-youtube-readiness.mjs']);
run('Test readiness', npm, ['run','test:readiness']);

const youtube = JSON.parse(readFileSync('out/youtube-readiness/summary.json','utf8'));
const readiness = JSON.parse(readFileSync('out/test-readiness/summary.json','utf8'));
if (youtube.status !== 'passed' || youtube.head !== startHead) fail('YouTube-Readiness-Report ist nicht PASS für den aktuellen HEAD.');
if (readiness.status !== 'passed' || readiness.head !== startHead) fail('Test-Readiness-Report ist nicht PASS für den aktuellen HEAD.');

const finalStatus = execFileSync('git',['status','--porcelain','--untracked-files=no'],{encoding:'utf8'}).trim();
if (finalStatus) fail(`Tracked Worktree wurde während Verify verändert:\n${finalStatus}`);

const summary = {
  status:'passed',
  head:startHead,
  node:process.version,
  npm:npmVersion,
  durationMs:Date.now()-startedAt,
  youtubeReadiness:'out/youtube-readiness/summary.json',
  testReadiness:'out/test-readiness/summary.json',
  completedAt:new Date().toISOString(),
};
mkdirSync(reportDir,{recursive:true});
writeFileSync(reportPath,`${JSON.stringify(summary,null,2)}\n`,'utf8');
console.log(`\nPRE-YOUTUBE RUNTIME VERIFY PASSED for ${startHead}`);
console.log(`Report: ${reportPath}`);
console.log('Repository runtime is ready for the first LONGFORM_V1 YouTube production.');
