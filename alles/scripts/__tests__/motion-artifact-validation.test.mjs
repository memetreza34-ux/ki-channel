import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  describeMotionArtifactFailure,
  inspectMotionArtifactBuffer,
} from '../motion-artifact-validation.mjs';

const createPngHeader = (width = 1080, height = 1920) => {
  const header = Buffer.alloc(32);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(header, 0);
  header.writeUInt32BE(13, 8);
  header.write('IHDR', 12, 'ascii');
  header.writeUInt32BE(width, 16);
  header.writeUInt32BE(height, 20);
  return header;
};

const createMp4Header = () => {
  const header = Buffer.alloc(32);
  header.writeUInt32BE(24, 0);
  header.write('ftyp', 4, 'ascii');
  header.write('isom', 8, 'ascii');
  return header;
};

describe('Motion-Render-Artefaktprüfung', () => {
  it('akzeptiert plausible 1080x1920-PNG-Dateien', () => {
    const result = inspectMotionArtifactBuffer({
      extension: '.png',
      sizeBytes: 4096,
      header: createPngHeader(),
    });

    assert.equal(result.valid, true);
    assert.equal(result.signatureValid, true);
    assert.equal(result.dimensionsValid, true);
    assert.equal(result.width, 1080);
    assert.equal(result.height, 1920);
  });

  it('lehnt PNG-Dateien mit falschen Abmessungen ab', () => {
    const result = inspectMotionArtifactBuffer({
      extension: 'png',
      sizeBytes: 4096,
      header: createPngHeader(1920, 1080),
    });

    assert.equal(result.valid, false);
    assert.equal(result.dimensionsValid, false);
    assert.match(describeMotionArtifactFailure(result), /falsche Abmessungen/);
  });

  it('lehnt zu kleine PNG-Dateien trotz korrektem Header ab', () => {
    const result = inspectMotionArtifactBuffer({
      extension: '.png',
      sizeBytes: 32,
      header: createPngHeader(),
    });

    assert.equal(result.valid, false);
    assert.equal(result.minimumSizeValid, false);
    assert.match(describeMotionArtifactFailure(result), /zu klein/);
  });

  it('akzeptiert plausible MP4-Dateien mit ftyp-Header', () => {
    const result = inspectMotionArtifactBuffer({
      extension: '.mp4',
      sizeBytes: 8192,
      header: createMp4Header(),
    });

    assert.equal(result.valid, true);
    assert.equal(result.signatureValid, true);
    assert.equal(result.minimumSizeValid, true);
  });

  it('lehnt falsche Signaturen und unbekannte Dateitypen ab', () => {
    const invalidMp4 = inspectMotionArtifactBuffer({
      extension: '.mp4',
      sizeBytes: 8192,
      header: Buffer.alloc(32),
    });
    assert.equal(invalidMp4.valid, false);
    assert.match(describeMotionArtifactFailure(invalidMp4), /Signatur/);

    const unknown = inspectMotionArtifactBuffer({
      extension: '.webm',
      sizeBytes: 8192,
      header: Buffer.alloc(32),
    });
    assert.equal(unknown.valid, false);
    assert.equal(unknown.mediaType, 'unknown');
  });
});
