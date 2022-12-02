import { TipType } from '@ts-error-messages/parser';
import { run } from '.';

const [, , tipType] = process.argv;

if (!tipType) {
  console.log('You must pass <tipType>');
  process.exit(1);
}

run(tipType as TipType).catch((e) => {
  console.log(e);
  process.exit(1);
});
