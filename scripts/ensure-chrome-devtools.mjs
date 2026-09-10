#!/usr/bin/env node
import {existsSync} from 'node:fs';
import {mkdir} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import process from 'node:process';

const endpoint = 'http://127.0.0.1:9222/json/version';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const reachable = async () => {
  try {
    const response = await fetch(endpoint, {signal: AbortSignal.timeout(1200)});
    return response.ok;
  } catch {
    return false;
  }
};

if (await reachable()) {
  console.log('CHROME DEVTOOLS: READY — endpoint already reachable at 127.0.0.1:9222');
  process.exit(0);
}

const candidates = process.platform === 'darwin'
  ? [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      path.join(os.homedir(), 'Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
    ]
  : process.platform === 'win32'
    ? [
        path.join(process.env['PROGRAMFILES'] || '', 'Google/Chrome/Application/chrome.exe'),
        path.join(process.env['PROGRAMFILES(X86)'] || '', 'Google/Chrome/Application/chrome.exe'),
        path.join(process.env['LOCALAPPDATA'] || '', 'Google/Chrome/Application/chrome.exe'),
      ]
    : ['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'];

const chrome = candidates.find((candidate) => candidate && existsSync(candidate));
if (!chrome) {
  console.error('CHROME DEVTOOLS FAILED: no supported local Chrome/Chromium executable found.');
  process.exit(1);
}

const profileDir = path.resolve('out','chrome-devtools-profile');
await mkdir(profileDir, {recursive:true});
const child = spawn(chrome, [
  '--remote-debugging-port=9222',
  `--user-data-dir=${profileDir}`,
  '--no-first-run',
  '--no-default-browser-check',
  'about:blank',
], {detached:true, stdio:'ignore'});
child.unref();

for (let attempt = 0; attempt < 16; attempt++) {
  await sleep(500);
  if (await reachable()) {
    console.log(`CHROME DEVTOOLS: READY — launched isolated browser profile at ${profileDir}`);
    console.log('endpoint: http://127.0.0.1:9222');
    process.exit(0);
  }
}

console.error('CHROME DEVTOOLS FAILED: Chrome launched but 127.0.0.1:9222 did not become reachable.');
process.exit(1);
