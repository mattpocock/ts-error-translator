import { TipType } from '@ts-error-messages/parser';
import { run } from '.';

run().catch((e) => {
  console.log(e);
  process.exit(1);
});
