import * as fs from 'fs/promises';
import * as path from 'path';
import fm from 'front-matter';

const bundleErrors = async () => {
  const dir = path.resolve(__dirname, '../../../packages/engine/errors');

  const allFiles = (await fs.readdir(dir)).map((file) => ({
    fullPath: path.resolve(dir, file),
    code: path.parse(file).name,
  }));

  const json: Record<string, any> = {};

  for (const file of allFiles) {
    const fileResult = await fs.readFile(file.fullPath, 'utf8');
    try {
      const parseResult = fm<{ excerpt: string }>(fileResult);

      let body = parseResult.body;
      let excerpt = parseResult.attributes.excerpt;

      json[file.code] = {
        body,
        excerpt,
        code: file.code,
      };
    } catch (e: any) {
      throw new Error(`Error at ${file.code}.md: ${e.message}`);
    }
  }

  await fs.writeFile(
    path.resolve(__dirname, './bundleErrors.json'),
    JSON.stringify(json, null, 2),
  );
};

bundleErrors().catch((e) => {
  console.error(e);
  process.exit(1);
});
