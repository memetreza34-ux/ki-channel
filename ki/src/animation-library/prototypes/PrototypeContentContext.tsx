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
  labels: Readonly<Record<string, string>>;
  values: Readonly<Record<string, string | number>>;
};

const PrototypeContentContext = createContext<ResolvedPrototypeContent | null>(
  null,
);

const resolvePrototypeContent = (
  content: PrototypeContentInput,
): ResolvedPrototypeContent | null => {
  const spokenText = content.spokenText?.trim() ?? '';
  const meaningContract = content.meaningContract ??
    (spokenText ? enhanceSceneMeaning(spokenText) : null);
  if (!meaningContract) return null;

  return {
    title: content.title?.trim() || null,
    spokenText,
    meaningContract,
    labels: Object.freeze({...content.labels ?? {}}),
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
