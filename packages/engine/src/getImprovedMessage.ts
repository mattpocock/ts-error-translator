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

    const parseResult = fm(fileResult);

    return fillBodyWithItems(parseResult.body, items);
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const fillBodyWithItems = (body: string, items: (string | number)[]) => {
  items.forEach((item, index) => {
    const bodyRegex = new RegExp(`'?\\\{${index}\\\}'?`, 'g');
    body = body.replace(bodyRegex, '`' + item + '`');
  });

  return {
    body,
  };
};
