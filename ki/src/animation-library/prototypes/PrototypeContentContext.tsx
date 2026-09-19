import React, {
  createContext,
  useContext,
  type ComponentType,
  type ReactNode,
} from 'react';
import {enhanceSceneMeaning} from '../extendedMeaningContract';
import type {SceneMeaningContract} from '../meaningContract';

export type PrototypeContentInput = {
  title?: string;
  spokenText?: string;
  meaningContract?: SceneMeaningContract;
  labels?: Record<string, string>;
  values?: Record<string, string | number>;
};

export type PrototypeRenderProps = {
  content?: PrototypeContentInput | null;
};

export type ResolvedPrototypeContent = {
  title: string | null;
  spokenText: string;
  meaningContract: SceneMeaningContract;
  sourceMeaningContract: SceneMeaningContract;
  labels: Readonly<Record<string, string>>;
  values: Readonly<Record<string, string | number>>;
};

const PrototypeContentContext = createContext<ResolvedPrototypeContent | null>(
  null,
);

const humanizeTerm = (value: string): string =>
  value.replace(/[-_]+/g, ' ').trim();

const compactTerms = (
  values: readonly string[],
  maximum = 4,
): string =>
  [...new Set(values.map(humanizeTerm).filter((value) => value.length >= 2))]
    .slice(0, maximum)
    .join(' · ');

const matchCount = (value: string, pattern: RegExp): number =>
  value.match(pattern)?.length ?? 0;

const likelyEnglishState = (value: string): boolean => {
  // Strong markers are English grammar/action words that are unlikely to appear
  // naturally in a German render state. Technical nouns such as input/output/result
  // and weak articles are deliberately insufficient on their own. This prevents
  // German sentences such as “An der Grenze …” from being mistaken for English.
  const strongMarkerCount = matchCount(
    value,
    /\b(multiple|several|visible|through|while|without|into|from|remains|changes|shows|begins|ends|waits|moves|becomes|increases|reduces|fixed|clearly|labeled)\b/gi,
  );
  if (strongMarkerCount > 0) return true;

  // Vetorecht fuer Deutsch: "an" und "a" sind auch deutsche Woerter, deshalb
  // reichen zwei schwache Marker allein nicht aus. Ein Satz wie
  // "An der Grenze steigt die Last sichtbar an." enthaelt "an" zweimal und wurde
  // sonst faelschlich als Englisch verworfen und durch Begriffsketten ersetzt.
  const germanMarkerCount = matchCount(
    value,
    /\b(der|die|das|den|dem|des|ein|eine|einer|einem|eines|und|nicht|noch|auch|sich|wird|werden|bleibt|bleiben|steigt|sinkt|sichtbar|zunaechst|zun\u00e4chst|waehrend|w\u00e4hrend|am|im|beim|zum|zur|vom|als|bis)\b/gi,
  );
  if (germanMarkerCount >= 2) return false;

  const weakMarkerCount = matchCount(
    value,
    /\b(the|a|an|one|state|result|input|output|and)\b/gi,
  );
  return weakMarkerCount >= 2;
};

const renderState = ({
  supplied,
  original,
  fallback,
}: {
  supplied: string | undefined;
  original: string;
  fallback: string;
}): string => {
  const explicit = supplied?.trim();
  if (explicit) return explicit;
  if (!likelyEnglishState(original)) return original;
  return fallback || original;
};

const createRenderContract = ({
  spokenText,
  contract,
  labels,
}: {
  spokenText: string;
  contract: SceneMeaningContract;
  labels: Readonly<Record<string, string>>;
}): SceneMeaningContract => {
  const startTerms = compactTerms(contract.subjectTerms);
  const resultTerms = compactTerms(contract.resultTerms);
  const actionTerms = compactTerms(contract.actionTerms, 3);
  const visibleFallback = actionTerms && resultTerms
    ? `${actionTerms} → ${resultTerms}`
    : spokenText || actionTerms || resultTerms;

  return {
    ...contract,
    startState: renderState({
      supplied: labels.startState,
      original: contract.startState,
      fallback: startTerms || spokenText,
    }),
    visibleChange: renderState({
      supplied: labels.visibleChange,
      original: contract.visibleChange,
      fallback: visibleFallback,
    }),
    endState: renderState({
      supplied: labels.endState,
      original: contract.endState,
      fallback: resultTerms || spokenText,
    }),
  };
};

export const resolvePrototypeContent = (
  content: PrototypeContentInput,
): ResolvedPrototypeContent | null => {
  const spokenText = content.spokenText?.trim() ?? '';
  const sourceMeaningContract = content.meaningContract ??
    (spokenText ? enhanceSceneMeaning(spokenText) : null);
  if (!sourceMeaningContract) return null;
  const labels = Object.freeze({...content.labels ?? {}});

  return {
    title: content.title?.trim() || null,
    spokenText,
    sourceMeaningContract,
    meaningContract: createRenderContract({
      spokenText,
      contract: sourceMeaningContract,
      labels,
    }),
    labels,
    values: Object.freeze({...content.values ?? {}}),
  };
};

export const PrototypeContentProvider: React.FC<{
  content?: PrototypeContentInput | null;
  children: ReactNode;
}> = ({content, children}) => {
  const resolved = content ? resolvePrototypeContent(content) : null;
  return (
    <PrototypeContentContext.Provider value={resolved}>
      {children}
    </PrototypeContentContext.Provider>
  );
};

export const usePrototypeContent = (): ResolvedPrototypeContent | null =>
  useContext(PrototypeContentContext);

export const getPrototypeLabel = ({
  content,
  key,
  fallback,
}: {
  content: ResolvedPrototypeContent | null;
  key: string;
  fallback: string;
}): string => content?.labels[key]?.trim() || fallback;

export const getPrototypeValue = ({
  content,
  key,
  fallback,
}: {
  content: ResolvedPrototypeContent | null;
  key: string;
  fallback: string | number;
}): string | number => content?.values[key] ?? fallback;

export const createContentAwarePrototype = (
  Component: ComponentType,
): React.FC<PrototypeRenderProps> => {
  const ContentAwarePrototype: React.FC<PrototypeRenderProps> = ({content}) => (
    <PrototypeContentProvider content={content}>
      <Component />
    </PrototypeContentProvider>
  );
  ContentAwarePrototype.displayName =
    `ContentAware${Component.displayName ?? Component.name ?? 'Prototype'}`;
  return ContentAwarePrototype;
};