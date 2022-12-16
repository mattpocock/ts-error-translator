import { TipType } from '@total-typescript/tips-parser';
import { run } from '.';

run().catch((e) => {
  console.log(e);
  process.exit(1);
});
