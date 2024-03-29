import { AureliaDocgenCLI } from './services/aurelia-docgen-cli';
import * as c from 'ansi-colors';
import { EOL } from 'node:os';
import { parentPort } from 'worker_threads';
import { FSWatcher } from 'node:fs';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version, name } = require('./../package.json');

let fsWatch: FSWatcher;
function closeWatch() {
  if (fsWatch) {
    fsWatch.close();
    fsWatch = undefined;
  }
}

function onExitMsg(msg) {
  if (msg === AureliaDocgenCLI.MSG_EXIT) {
    closeWatch();
    logAndExit();
  }
}

if (parentPort) {
  parentPort.on('message', onExitMsg);
} else {
  process.on('message', onExitMsg);
  process.on('exit', () => {
    closeWatch();
  });
}

function logAndExit() {
  process.stdout.write(c.greenBright(`[${name}] done.` + EOL), () => {
    process.exit(0);
  });
}

const blueBright = c.bold.underline.blueBright;
console.log(blueBright(`[${name}] version ${version}.`));

try {
  const au2Docgen = new AureliaDocgenCLI();
  if (au2Docgen.mustWatch) {
    fsWatch = au2Docgen.watchStories();
    console.log(blueBright(`[${name}] Listen for modifications...`));
  } else {
    au2Docgen.writeStories();
    logAndExit();
  }
} catch (error) {
  process.stdout.write(c.red(`[${name}] ${error.message}.` + EOL), () => {
    process.exit(1);
  });
}
