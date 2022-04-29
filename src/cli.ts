import { AureliaStoriesCLI } from './services/aurelia-stories-cli';
import * as c from 'ansi-colors';
import { EOL } from 'os';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version, name } = require('./../package.json');

const blueBright = c.bold.underline.blueBright;
console.log(blueBright(`[${name}] version ${version}.`));

try {
  const au2Storybook = new AureliaStoriesCLI();
  au2Storybook.writeStories();
  process.stdout.write(c.greenBright(`[${name}] done.` + EOL), () => {
    process.exit(0);
  });
} catch (error) {
  process.stdout.write(c.red(`[${name}] ${error.message}.` + EOL), () => {
    process.exit(1);
  });
}
