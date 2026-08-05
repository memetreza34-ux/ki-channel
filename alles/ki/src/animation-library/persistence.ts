import {z} from 'zod';
import {creativeBrainStateSchema} from './schema';
import type {CreativeBrainState} from './schema';

export const creativeBrainSnapshotSchema = z.object({
  version: z.literal(1),
  catalogVersion: z.literal(1),
  createdAt: z.string().datetime(),
  fingerprint: z.string().regex(/^[a-f0-9]{8}$/),
  state: creativeBrainStateSchema,
});

export type CreativeBrainSnapshot = z.infer<
  typeof creativeBrainSnapshotSchema
>;

const canonicalize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, child]) => [key, canonicalize(child)]),
    );
  }
  return value;
};

export const stableStringify = (value: unknown): string =>
  JSON.stringify(canonicalize(value));

export const createPortableFingerprint = (value: unknown): string => {
  const text = stableStringify(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

export const createCreativeBrainSnapshot = ({
  state,
  createdAt,
}: {
  state: CreativeBrainState;
  createdAt: string;
}): CreativeBrainSnapshot => {
  const parsedState = creativeBrainStateSchema.parse(state);
  return creativeBrainSnapshotSchema.parse({
    version: 1,
    catalogVersion: 1,
    createdAt,
    fingerprint: createPortableFingerprint(parsedState),
    state: parsedState,
  });
};

export const serializeCreativeBrainSnapshot = (
  snapshot: CreativeBrainSnapshot,
): string => `${JSON.stringify(creativeBrainSnapshotSchema.parse(snapshot), null, 2)}\n`;

export const parseCreativeBrainSnapshot = (
  serialized: string,
): CreativeBrainSnapshot => {
  const snapshot = creativeBrainSnapshotSchema.parse(JSON.parse(serialized));
  const expectedFingerprint = createPortableFingerprint(snapshot.state);
  if (snapshot.fingerprint !== expectedFingerprint) {
    throw new Error(
      `creative brain fingerprint mismatch: expected ${expectedFingerprint}, received ${snapshot.fingerprint}`,
    );
  }
  return snapshot;
};
