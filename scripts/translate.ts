import fs from 'fs'
import path from 'path'
import { logger } from './utils/logger'

const errorCode = process.argv[2]

if (!errorCode) {
  logger.error(`\nYou've to provide an error code for your translation!`)
  logger.info(`Example:`)
  logger.info(`  yarn translate 1006`)
  process.exit(1)
}

const template = fs.readFileSync(
  path.join(__dirname, './templates/error.md'),
  'utf-8'
)

const errorPath = `packages/engine/errors/${errorCode}.md`

if (fs.existsSync(errorPath)) {
  logger.error(`\nTranslation for error code ${errorCode} already exists!`)
  process.exit(1)
}

fs.writeFileSync(errorPath, template)

logger.success('\nTemplate has been written Successfuly!')
logger.info(`Check: ${errorPath}`)
