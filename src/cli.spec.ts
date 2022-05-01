import * as assert from 'assert';
import { tmpdir } from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { spawn, spawnSync } from 'child_process';
import { AureliaStoriesCLI } from './services/aurelia-stories-cli';

describe('cli', () => {
  it('Process, lifecycle', async () => {
    const tmp = path.join(tmpdir(), `aurelia-stories-${Date.now()}`);
    try {
      fs.mkdirSync(tmp);
      const results = spawnSync(`node`, [path.join(process.cwd(), './src/cli.worker.js'), '--projectDir', process.cwd(), '--out', tmp], { encoding: 'utf-8' });
      results.output.forEach(msg => {
        if (msg) {
          console.log(msg);
        }
      });
      const files = fs.readdirSync(tmp);
      assert.strictEqual(files.length, 0);
    } finally {
      fs.rmdirSync(tmp);
    }
  });

  it('Process, lifecycle watch', async () => {
    const tmp = path.join(tmpdir(), `aurelia-stories-${Date.now()}`);
    try {
      fs.mkdirSync(tmp);
      await new Promise<void>((resolve, reject) => {
        const spawnProc = spawn(`node`, [path.join(process.cwd(), './src/cli.worker.js'), '--watch', '--projectDir', process.cwd(), '--out', tmp], { cwd: process.cwd(), stdio: ['inherit', 'inherit', 'inherit', 'ipc'] });
        spawnProc.on('message', msg => {
          if (msg === AureliaStoriesCLI.MSG_WATCHING) {
            const files = fs.readdirSync(tmp);
            assert.strictEqual(files.length, 0);
            spawnProc.send(AureliaStoriesCLI.MSG_EXIT);
          }
        });
        spawnProc.on('exit', code => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          } else {
            resolve();
          }
        });
      });
    } finally {
      fs.rmdirSync(tmp);
    }
  });
});
