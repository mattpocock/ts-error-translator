const micromatch = require('micromatch');
const prettier = require('prettier');

const prettierSupportedExtensions = prettier
  .getSupportInfo()
  .languages.map(({ extensions }) => extensions)
  .flat();
const addQuotes = (a) => `"${a}"`;

module.exports = (allStagedFiles) => {
  const prettierFiles = micromatch(
    allStagedFiles,
    prettierSupportedExtensions.map((extension) => `**/*${extension}`),
  );

  return [
    prettierFiles.length &&
      `prettier --write ${prettierFiles.map(addQuotes).join(' ')}`,
  ].filter(Boolean);
};
