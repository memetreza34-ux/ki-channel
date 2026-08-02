import {motionStoryboardSchema, type MotionStoryboard} from './schema';

export type MotionValidationIssue = {
  path: string;
  message: string;
};

export type MotionValidationResult =
  | {ok: true; storyboard: MotionStoryboard; issues: []}
  | {ok: false; storyboard: null; issues: MotionValidationIssue[]};

const formatPath = (path: PropertyKey[]) =>
  path.length === 0 ? 'storyboard' : path.map(String).join('.');

export const validateMotionStoryboard = (input: unknown): MotionValidationResult => {
  const result = motionStoryboardSchema.safeParse(input);
  if (result.success) {
    return {ok: true, storyboard: result.data, issues: []};
  }

  return {
    ok: false,
    storyboard: null,
    issues: result.error.issues.map((issue) => ({
      path: formatPath(issue.path),
      message: issue.message,
    })),
  };
};

export const assertMotionStoryboard = (input: unknown): MotionStoryboard => {
  const result = validateMotionStoryboard(input);
  if (result.ok) return result.storyboard;

  const details = result.issues.map((issue) => `${issue.path}: ${issue.message}`).join('; ');
  throw new Error(`Ungültiges Motion-Storyboard: ${details}`);
};
