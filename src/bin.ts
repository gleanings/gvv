#!/usr/bin/env node

import { command } from './command';
import { dog } from './dog';
import { main } from './main';

(async () => {
  try {
    await main();
  } catch (error) {
    dog.error(error);
    command.end();
  }
})();
