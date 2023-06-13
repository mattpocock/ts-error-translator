import { expect, it } from 'vitest';
import { getTipsFromFile } from '../getTipsFromFile';

it('Should figure out as const', () => {
  const fileContents = `
  const yeah = '' as const;
`;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toEqual(['as-const']);
});

it('t-prefix-in-generic-arguments', () => {
  const fileContents = `
  type Yeah<T> = T;
  `;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toContain('t-prefix-in-generic-arguments');
});

it('generic-component-declaration in arrow functions', () => {
  const fileContents = `
  const Component = <T>() => {};
  `;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toContain('generic-component-declaration');
});

it('generic-component-declaration in normal functions', () => {
  const fileContents = `
  function Component<T>() {}
  `;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toContain('generic-component-declaration');
});

it('Union type', () => {
  const fileContents = `
  type Yeah = string | number;
  `;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toEqual([
    'type-alias-declaration',
    'union-type',
    'basic-types',
    'basic-types',
  ]);
});

it('Templates with as const', () => {
  const fileContents = `
  const yeah = \`\` as const;
  `;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toEqual(['as-const', 'template-as-const']);
});

it('as assertions', () => {
  const fileContents = `
  const yeah = \`\` as string;
  `;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toEqual(['as-assertion', 'basic-types']);
});

it('Extract', () => {
  const fileContents = `
  type Yeah = Extract<{}, {}>
  `;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toContain('extract-utility-type');
});

it('Typeof Import', () => {
  const fileContents = `
  type Yeah = typeof import('react-redux')
  `;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toContain('typeof-import');
});

it('passing-types-to-call-expressions', () => {
  const fileContents = `
  func<{}>();
  `;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toContain('passing-types-to-call-expressions');
});
