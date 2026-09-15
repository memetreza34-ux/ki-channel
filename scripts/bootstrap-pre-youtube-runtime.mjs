#!/usr/bin/env node
import {existsSync, statSync} from 'node:fs';
import {execFileSync, spawnSync} from 'node:child_process';
import process from 'node:process';

const fail = (message, code = 1) => {
  console.error(`PRE-YOUTUBE RUNTIME BOOTSTRAP FAILED: ${message}`);
  process.exit(code);
};

const nodeMajor = Number(process.versions.node.split('.')[0]);
if (nodeMajor !== 24) fail(`Node 24 LTS ist Pflicht, aktiv ist ${process.version}.`);

const npmVersion = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['--version'], {encoding:'utf8'});
if (npmVersion.error || npmVersion.status !== 0) fail('npm ist nicht verfügbar.');
const npmText = String(npmVersion.stdout || '').trim();
if (Number(npmText.split('.')[0]) !== 11) fail(`npm 11 ist Pflicht für den kanonischen Lockfile, aktiv ist ${npmText}.`);

const trackedStatus = execFileSync('git', ['status','--porcelain','--untracked-files=no'], {encoding:'utf8'}).trim();
if (trackedStatus) fail(`Tracked Worktree ist nicht sauber:\n${trackedStatus}`);

console.log(`Runtime bootstrap: Node ${process.version}, npm ${npmText}`);
console.log('Installing canonical workspaces and generating package-lock.json...');
const install = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install','--no-audit','--no-fund'], {
  stdio:'inherit',
  env:process.env,
});
if (install.error || install.status !== 0) fail(`npm install fehlgeschlagen (${install.status ?? 'unknown'}).`, install.status ?? 1);

if (!existsSync('package-lock.json') || !statSync('package-lock.json').isFile() || statSync('package-lock.json').size < 100) {
  fail('npm install hat keinen gültigen package-lock.json erzeugt.');
}

let tracked = true;
try {
  execFileSync('git', ['ls-files','--error-unmatch','package-lock.json'], {stdio:'ignore'});
} catch {
  tracked = false;
}
const lockStatus = execFileSync('git', ['status','--porcelain','--','package-lock.json'], {encoding:'utf8'}).trim();

console.log('PRE-YOUTUBE RUNTIME BOOTSTRAP: INSTALL PASSED');
if (!tracked || lockStatus) {
  console.log('package-lock.json wurde real erzeugt/geändert und muss jetzt committed werden.');
  console.log('Danach ausführen: npm run runtime:verify');
  process.exit(2);
}
console.log('package-lock.json ist bereits committed und unverändert. Next: npm run runtime:verify');
