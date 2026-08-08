import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {getMasterplanContentSourceFingerprint} from './masterplan-content-release-utils.mjs';

export const getEdgeCaseSourceFingerprint = async () => {
  const hash = createHash('sha256');
  const productionFingerprint = await getMasterplanContentSourceFingerprint();
  hash.update('masterplan-production-fingerprint');
  hash.update('\0');
  hash.update(productionFingerprint);
  hash.update('\0');

  const edgeFiles = [
    'ki/src/animation-library/content-motion-edge-cases.json',
    'scripts/check-content-motion-edge-cases.mjs',
    'scripts/render-content-motion-edge-cases.mjs',
    'scripts/verify-content-motion-edge-case-renders.mjs',
    'scripts/edge-case-release-utils.mjs',
  ];

  for (const file of edgeFiles) {
    hash.update(file);
    hash.update('\0');
    hash.update(await readFile(resolve(file)));
    hash.update('\0');
  }

  return hash.digest('hex');
};
