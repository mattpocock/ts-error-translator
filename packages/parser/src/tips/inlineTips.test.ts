import { expect, it } from 'vitest';
import { getTipsFromFile } from '../getTipsFromFile';

it('Should figure out as const', () => {
  const fileContents = `
  const yeah = '' as const;
  `;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toEqual(['as-const']);
});

it('Templates with as const', () => {
  const fileContents = `
  const yeah = \`\` as const;
  `;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toEqual(['as-const', 'template-as-const']);
});
