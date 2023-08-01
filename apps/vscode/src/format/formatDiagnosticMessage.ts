import { inlineCodeBlock, unStyledCodeBlock } from '../components';
import { formatTypeBlock } from './formatTypeBlock';

const formatTypeScriptBlock = (_: string, code: string) =>
  inlineCodeBlock(code, 'typescript');

const formatSimpleTypeBlock = (_: string, code: string) =>
  inlineCodeBlock(code, 'type');

export const formatDiagnosticMessage = (message: string) =>
  message
    // format declare module snippet
    .replaceAll(
      /['“](declare module )['”](.*)['“];['”]/g,
      (_: string, p1: string, p2: string) =>
        formatTypeScriptBlock(_, `${p1} "${p2}"`),
    )
    // format missing props error
    .replaceAll(
      /(is missing the following properties from type )'(.*)': (.+?)(?=and|$)/g,
      (_, pre, type, post) =>
        `${pre}${formatTypeBlock('', type)}: <ul>${post
          .split(', ')
          .filter(Boolean)
          .map((prop: string) => `<li>${prop}</li>`)
          .join('')}</ul>`,
    )
    // Format type pairs
    .replaceAll(
      /(types) ['“](.*?)['”] and ['“](.*?)['”][\.]?/gi,
      (_: string, p1: string, p2: string, p3: string) =>
        `${formatTypeBlock(p1, p2)} and ${formatTypeBlock('', p3)}`,
    )
    // Format type annotation options
    .replaceAll(
      /type annotation must be ['“](.*?)['”] or ['“](.*?)['”][\.]?/gi,
      (_: string, p1: string, p2: string, p3: string) =>
        `${formatTypeBlock(p1, p2)} or ${formatTypeBlock('', p3)}`,
    )
    .replaceAll(
      /(Overload \d of \d), ['“](.*?)['”], /gi,
      (_, p1: string, p2: string) => `${p1}${formatTypeBlock('', p2)}`,
    )
    // format simple strings
    .replaceAll(/^['“]"[^"]*"['”]$/g, formatTypeScriptBlock)
    // Format string types
    .replaceAll(
      /(module|file|file name) "(.*?)"(?=[\s(.|,)])/gi,
      (_, p1: string, p2: string) => formatTypeBlock(p1, `"${p2}"`),
    )
    // Format types
    .replaceAll(
      /(type|type alias|interface|module|file|file name|method's|subtype of constraint) ['“](.*?)['“](?=[\s(.|,)])/gi,
      (_, p1: string, p2: string) => formatTypeBlock(p1, p2),
    )
    // Format reversed types
    .replaceAll(
      /(.*)['“]([^>]*)['”] (type|interface|return type|file|module|is (not )?assignable)/gi,
      (_: string, p1: string, p2: string, p3: string) =>
        `${p1}${formatTypeBlock('', p2)} ${p3}`,
    )
    // Format simple types that didn't captured before
    .replaceAll(
      /['“]((void|null|undefined|any|boolean|string|number|bigint|symbol)(\[\])?)['”]/g,
      formatSimpleTypeBlock,
    )
    // Format some typescript key words
    .replaceAll(
      /['“](import|export|require|in|continue|break|let|false|true|const|new|throw|await|for await|[0-9]+)( ?.*?)['”]/g,
      (_: string, p1: string, p2: string) =>
        formatTypeScriptBlock(_, `${p1}${p2}`),
    )
    // Format return values
    .replaceAll(
      /(return|operator) ['“](.*?)['”]/gi,
      (_, p1: string, p2: string) => `${p1} ${formatTypeScriptBlock('', p2)}`,
    )
    // Format regular code blocks
    .replaceAll(
      /['“]((?:(?!:\s*}).)*?)['“] (?!\s*:)/g,
      (_: string, p1: string) => `${unStyledCodeBlock(p1)} `,
    );