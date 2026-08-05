export const MOTION_ARTIFACT_REQUIREMENTS = Object.freeze({
  png: Object.freeze({
    width: 1080,
    height: 1920,
    minimumSizeBytes: 1024,
  }),
  mp4: Object.freeze({
    minimumSizeBytes: 4096,
  }),
});

const PNG_SIGNATURE = Buffer.from([
  0x89,
  0x50,
  0x4e,
  0x47,
  0x0d,
  0x0a,
  0x1a,
  0x0a,
]);

const normalizeExtension = (extension) =>
  extension.toLowerCase().replace(/^\./, '');

export const inspectMotionArtifactBuffer = ({
  extension,
  sizeBytes,
  header,
}) => {
  const normalizedExtension = normalizeExtension(extension);

  if (normalizedExtension === 'png') {
    const signatureValid =
      header.length >= PNG_SIGNATURE.length &&
      header.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE);
    const ihdrValid =
      header.length >= 24 && header.subarray(12, 16).toString('ascii') === 'IHDR';
    const width = ihdrValid ? header.readUInt32BE(16) : null;
    const height = ihdrValid ? header.readUInt32BE(20) : null;
    const dimensionsValid =
      width === MOTION_ARTIFACT_REQUIREMENTS.png.width &&
      height === MOTION_ARTIFACT_REQUIREMENTS.png.height;
    const minimumSizeValid =
      sizeBytes >= MOTION_ARTIFACT_REQUIREMENTS.png.minimumSizeBytes;

    return {
      mediaType: 'png',
      signatureValid: signatureValid && ihdrValid,
      dimensionsValid,
      minimumSizeValid,
      width,
      height,
      valid: signatureValid && ihdrValid && dimensionsValid && minimumSizeValid,
    };
  }

  if (normalizedExtension === 'mp4') {
    const signatureValid =
      header.length >= 8 && header.subarray(4, 8).toString('ascii') === 'ftyp';
    const minimumSizeValid =
      sizeBytes >= MOTION_ARTIFACT_REQUIREMENTS.mp4.minimumSizeBytes;

    return {
      mediaType: 'mp4',
      signatureValid,
      dimensionsValid: null,
      minimumSizeValid,
      width: null,
      height: null,
      valid: signatureValid && minimumSizeValid,
    };
  }

  return {
    mediaType: 'unknown',
    signatureValid: false,
    dimensionsValid: null,
    minimumSizeValid: false,
    width: null,
    height: null,
    valid: false,
  };
};

export const describeMotionArtifactFailure = (inspection) => {
  if (!inspection.minimumSizeValid) {
    return 'ist zu klein für ein plausibles Render-Artefakt';
  }
  if (!inspection.signatureValid) {
    return 'besitzt keine gültige PNG-/MP4-Signatur';
  }
  if (inspection.dimensionsValid === false) {
    return `besitzt falsche Abmessungen (${inspection.width ?? '?'} × ${inspection.height ?? '?'})`;
  }
  return 'ist technisch ungültig';
};
