import type {SceneMeaningContract} from './meaningContract';
import type {
  PrototypeContentInput,
  PrototypeRenderProps,
} from './prototypes/PrototypeContentContext';

export type PrototypeRenderPayloadInput = {
  spokenText: string;
  meaningContract: SceneMeaningContract;
  title?: string;
  labels?: Record<string, string>;
  values?: Record<string, string | number>;
};

const cleanRecord = <T extends string | number>(
  values: Readonly<Record<string, T>> | undefined,
): Record<string, T> =>
  Object.fromEntries(
    Object.entries(values ?? {}).filter(
      ([key, value]) => key.trim() && String(value).trim(),
    ),
  ) as Record<string, T>;

const titleFromContract = (contract: SceneMeaningContract): string => {
  const terms = contract.subjectTerms
    .filter((term) => term.trim().length >= 3)
    .slice(0, 3)
    .map((term) => term.replace(/[-_]+/g, ' '));
  if (terms.length > 0) return terms.join(' · ');
  return contract.communicationGoal.replace(/-/g, ' ');
};

const validateMeaningContract = (
  contract: SceneMeaningContract,
): void => {
  if (!contract.startState.trim()) {
    throw new Error('prototype render payload requires startState');
  }
  if (!contract.visibleChange.trim()) {
    throw new Error('prototype render payload requires visibleChange');
  }
  if (!contract.endState.trim()) {
    throw new Error('prototype render payload requires endState');
  }
  if (contract.requiredVisualCues.length === 0) {
    throw new Error('prototype render payload requires visual cues');
  }
};

export const createPrototypeRenderProps = ({
  spokenText,
  meaningContract,
  title,
  labels,
  values,
}: PrototypeRenderPayloadInput): PrototypeRenderProps => {
  const normalizedText = spokenText.trim();
  if (!normalizedText) {
    throw new Error('prototype render payload requires spokenText');
  }
  validateMeaningContract(meaningContract);

  const content: PrototypeContentInput = {
    title: title?.trim() || titleFromContract(meaningContract),
    spokenText: normalizedText,
    meaningContract,
    labels: cleanRecord(labels),
    values: cleanRecord(values),
  };

  return {content};
};

export const assertPrototypeRenderProps: (
  props: PrototypeRenderProps,
) => asserts props is {content: PrototypeContentInput} = (props) => {
  if (!props.content) {
    throw new Error('content-matched prototype render requires content props');
  }
  if (!props.content.spokenText?.trim()) {
    throw new Error('content-matched prototype render requires spokenText');
  }
  if (!props.content.meaningContract) {
    throw new Error('content-matched prototype render requires meaningContract');
  }
  validateMeaningContract(props.content.meaningContract);
};
