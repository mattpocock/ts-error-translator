import * as path from 'path';
import * as fs from 'fs';
import fm from 'front-matter';

export const getImprovedMessageFromMarkdown = (
  dir: string,
  code: number,
  items: (string | number)[],
) => {
  const file = path.join(dir, `${code}.md`);

  try {
    const fileResult = fs.readFileSync(file, 'utf8');

    const parseResult = fm<{ excerpt: string }>(fileResult);

    let excerpt = parseResult.attributes.excerpt;

    return fillExcerptWithItems(excerpt, items);
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const fillExcerptWithItems = (
  excerpt: string,
  items: (string | number)[],
) => {
  items.forEach((item, index) => {
    const excerptRegex = new RegExp(`'?\\\{${index}\\\}'?`, 'g');
    excerpt = excerpt.replace(excerptRegex, '`' + item + '`');
  });

  return {
    excerpt,
  };
};
