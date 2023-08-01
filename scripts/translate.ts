import fs from 'fs';
import { logger } from './utils/logger';
import tsErrorMessages from '../packages/engine/src/tsErrorMessages.json';

const errorCode = process.argv[2];

const getTemplate = (original: string) =>
  `---
original: "${original}"
---

Simplified version of the error message

`.trim();

if (!errorCode) {
  logger.error(`\nYou haven't provided an error code for your translation!`);
  logger.info(`Example:`);
  logger.info(`  yarn translate 1006`);
  process.exit(1);
} else {
  const errorPath = `packages/engine/errors/${errorCode}.md`;

  if (fs.existsSync(errorPath)) {
    logger.error(`\nTranslation for error code ${errorCode} already exists!`);
  } else {
    const originalError = Object.keys(tsErrorMessages).find((key) => {
      return String(tsErrorMessages[key].code) === errorCode;
    });

    fs.writeFileSync(errorPath, getTemplate(originalError!));

    logger.success('\nTemplate has been written Successfuly!');
    logger.info(`Check: ${errorPath}`);
  }
}
