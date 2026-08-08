import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import ts from 'typescript';

let cachedEnhancer = null;

const transpileModule = async (relativePath) => {
  const sourcePath = resolve(relativePath);
  const source = await readFile(sourcePath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    fileName: sourcePath,
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ES2020,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      isolatedModules: true,
      removeComments: false,
    },
  });

  const errors = (transpiled.diagnostics ?? []).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  );
  if (errors.length > 0) {
    const message = ts.formatDiagnosticsWithColorAndContext(errors, {
      getCanonicalFileName: (fileName) => fileName,
      getCurrentDirectory: () => process.cwd(),
      getNewLine: () => '\n',
    });
    throw new Error(`${relativePath} konnte nicht transpiliert werden:\n${message}`);
  }

  return transpiled.outputText;
};

const asDataUrl = (source) =>
  `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;

export const loadSceneMeaningEnhancer = async () => {
  if (cachedEnhancer) return cachedEnhancer;

  // meaningContract.ts only imports AnimationLibraryEntry as a TypeScript type,
  // so its emitted JavaScript is self-contained.
  const meaningSource = await transpileModule(
    'ki/src/animation-library/meaningContract.ts',
  );
  const meaningUrl = asDataUrl(meaningSource);

  // extendedMeaningContract.ts has one runtime dependency on meaningContract.
  // Replace that emitted relative import with the exact transpiled module URL so
  // Node can execute the same repository implementation without a TS runtime.
  const extendedSource = await transpileModule(
    'ki/src/animation-library/extendedMeaningContract.ts',
  );
  const linkedExtendedSource = extendedSource
    .replace("from './meaningContract'", `from '${meaningUrl}'`)
    .replace('from "./meaningContract"', `from '${meaningUrl}'`);

  if (linkedExtendedSource === extendedSource) {
    throw new Error(
      'Scene-Meaning-Enhancer konnte nicht gelinkt werden: Runtime-Import ./meaningContract fehlt nach TypeScript-Transpile.',
    );
  }

  const module = await import(asDataUrl(linkedExtendedSource));
  if (typeof module.enhanceSceneMeaning !== 'function') {
    throw new Error(
      'Transpilierter Scene-Meaning-Enhancer exportiert enhanceSceneMeaning nicht.',
    );
  }

  cachedEnhancer = module.enhanceSceneMeaning;
  return cachedEnhancer;
};
