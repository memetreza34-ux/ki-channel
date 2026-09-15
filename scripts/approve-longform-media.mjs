#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {createReadStream, existsSync, statSync} from 'node:fs';
import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const packageArg = args.find((arg) => !arg.startsWith('--'));
const option = (name, fallback = null) => {
  const prefix = `--${name}=`;
  const found = args.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
};
const fail = (message) => { console.error(`LONGFORM MEDIA APPROVAL FAILED: ${message}`); process.exit(1); };
const inside = (parent, child) => child === parent || child.startsWith(`${parent}${path.sep}`);
const sha256File = (file) => new Promise((resolveHash, reject) => {
  const hash = createHash('sha256');
  const stream = createReadStream(file);
  stream.on('data', (chunk) => hash.update(chunk));
  stream.on('end', () => resolveHash(hash.digest('hex')));
  stream.on('error', reject);
});

if (!packageArg) fail('Usage: node scripts/approve-longform-media.mjs <package> --asset-id=<id> --rights-note="..." --visual-note="..."');
const root = path.resolve(packageArg);
if (!existsSync(root) || !statSync(root).isDirectory()) fail(`package missing: ${root}`);
const assetId = String(option('asset-id', '') || '').trim();
const rightsNote = String(option('rights-note', '') || '').trim();
const visualNote = String(option('visual-note', '') || '').trim();
if (!assetId) fail('--asset-id is required.');
if (rightsNote.length < 24) fail('--rights-note must be a concrete review note of at least 24 characters.');
if (visualNote.length < 24) fail('--visual-note must be a concrete visual/timing review note of at least 24 characters.');

const mediaPlanPath = path.join(root, '02-visuals', 'MEDIA-PLAN.json');
if (!existsSync(mediaPlanPath)) fail('02-visuals/MEDIA-PLAN.json missing.');
let mediaPlan;
try { mediaPlan = JSON.parse(await readFile(mediaPlanPath, 'utf8')); }
catch (error) { fail(`invalid MEDIA-PLAN.json: ${error.message}`); }
const asset = (mediaPlan.assets || []).find((entry) => String(entry.assetId) === assetId);
if (!asset) fail(`assetId not found: ${assetId}`);
if (asset.status !== 'MATERIALIZED_PENDING_REVIEW') fail(`asset status must be MATERIALIZED_PENDING_REVIEW, got ${asset.status || 'missing'}.`);
if (!asset.localFile || /^https?:\/\//i.test(String(asset.localFile))) fail('asset requires a localFile before approval.');
const local = path.resolve(root, String(asset.localFile));
if (!inside(root, local)) fail('localFile escapes package root.');
if (!existsSync(local) || !statSync(local).isFile() || statSync(local).size < 1024) fail(`local materialized file missing/invalid: ${asset.localFile}`);
if (!/^[a-f0-9]{64}$/i.test(String(asset.sha256 || ''))) fail('asset requires a valid materialization SHA-256.');
const actualSha = await sha256File(local);
if (actualSha.toLowerCase() !== String(asset.sha256).toLowerCase()) fail('local file changed after materialization; SHA-256 mismatch. Materialize again before approval.');
if (asset.materialization?.exactFileSha256 && String(asset.materialization.exactFileSha256).toLowerCase() !== actualSha.toLowerCase()) fail('materialization record SHA does not match current file.');

const provenanceRel = asset.materialization?.provenanceFile;
if (!provenanceRel) fail('materialization provenanceFile missing.');
const provenancePath = path.resolve(root, provenanceRel);
if (!inside(root, provenancePath) || !existsSync(provenancePath) || !statSync(provenancePath).isFile()) fail('materialization provenance file missing or outside package.');
let provenance;
try { provenance = JSON.parse(await readFile(provenancePath, 'utf8')); }
catch (error) { fail(`invalid provenance JSON: ${error.message}`); }
if (String(provenance.assetId) !== assetId) fail('provenance assetId mismatch.');
if (provenance.rightsVerified === true) fail('materialization provenance unexpectedly claims rights approval before the approval step.');

const sourceType = String(asset.sourceType || '');
if (sourceType === 'GENERATED_NON_EVIDENTIARY' && asset.provesRealWorldClaim === true) fail('generated non-evidentiary media may not prove a real-world claim.');
if (!['USER_PROVIDED','GENERATED_NON_EVIDENTIARY'].includes(sourceType)) {
  if (!/^https:\/\//i.test(String(asset.sourceUrl || ''))) fail('external/official media requires an https sourceUrl.');
}
if (['LICENSED_SOURCE_VERIFIED','OPEN_LICENSE_VERIFIED','WIKIMEDIA_COMMONS'].includes(sourceType)) {
  if (!String(asset.license || provenance.license || '').trim()) fail('licensed/open media requires license metadata.');
}
if (provenance.attributionRequired === true && !String(provenance.attribution || '').trim()) fail('selected source requires attribution but provenance contains no attribution text.');

asset.rightsVerified = true;
asset.status = 'APPROVED';
asset.approval = {
  at: new Date().toISOString(),
  exactFileSha256: actualSha,
  rightsReviewNote: rightsNote,
  visualReviewNote: visualNote,
  sourceUrlReviewed: asset.sourceUrl || provenance.sourceUrl || null,
  licenseReviewed: asset.license || provenance.license || null,
  attribution: provenance.attribution || null,
  nonCopyrightRestrictionsReviewed: provenance.nonCopyrightRestrictionsReviewRequired === true ? true : null,
};
const requiredAssets = (mediaPlan.assets || []).filter((entry) => entry.requiredForRender !== false);
mediaPlan.status = requiredAssets.length > 0 && requiredAssets.every((entry) => entry.status === 'APPROVED' && entry.rightsVerified === true)
  ? 'READY_FOR_RENDER'
  : 'MATERIALIZATION_IN_PROGRESS';
await writeFile(mediaPlanPath, `${JSON.stringify(mediaPlan, null, 2)}\n`, 'utf8');

console.log('LONGFORM MEDIA APPROVAL: PASSED');
console.log(`asset: ${assetId}`);
console.log(`localFile: ${asset.localFile}`);
console.log(`sha256: ${actualSha}`);
console.log(`MEDIA-PLAN status: ${mediaPlan.status}`);
console.log('Approval is bound to this exact file SHA. Any later file change invalidates render-readiness.');
