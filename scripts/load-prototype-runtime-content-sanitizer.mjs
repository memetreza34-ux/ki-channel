import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import ts from 'typescript';

let cachedSanitizer = null;

export const loadPrototypeRuntimeContentSanitizer = async () => {
  if (cachedSanitizer) return cachedSanitizer;

  const sourcePath = resolve(
    'ki/src/animation-library/prototypeRuntimeContentSanitizer.ts',
  );
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
    throw new Error(
      `Prototype-Runtime-Content-Sanitizer konnte nicht transpiliert werden:\n${message}`,
    );
  }

  const moduleUrl =
    `data:text/javascript;base64,${Buffer.from(transpiled.outputText).toString('base64')}`;
  const module = await import(moduleUrl);
  if (typeof module.sanitizePrototypeRuntimeContent !== 'function') {
    throw new Error(
      'Transpilierter Prototype-Runtime-Content-Sanitizer exportiert sanitizePrototypeRuntimeContent nicht.',
    );
  }

  cachedSanitizer = module.sanitizePrototypeRuntimeContent;
  return cachedSanitizer;
};
