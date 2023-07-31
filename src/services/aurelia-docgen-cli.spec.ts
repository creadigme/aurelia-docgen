import { Worker } from 'worker_threads';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { tmpdir } from 'node:os';
import * as assert from 'node:assert';
import { AureliaDocgenCLI } from './aurelia-docgen-cli';
import { spawn, spawnSync } from 'node:child_process';

function ensureUnlink(filePath: string) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

describe('aurelia-docgen-cli', () => {
  it('Bad parameters', async () => {
    const tmp = path.join(tmpdir(), `aurelia-docgen-${Date.now()}`);
    try {
      fs.mkdirSync(tmp);
      await new Promise<void>((resolve, reject) => {
        const worker = new Worker(path.join(process.cwd(), './src/cli.worker.js'), {
          argv: ['--cdwd', process.cwd(), '--out', tmp],
          env: process.env,
        });
        worker.on('exit', code => {
          if (code !== 0) {
            assert.strictEqual(code, 1);
            resolve();
          } else {
            reject(new Error('Must failed: bad paramter.'));
          }
        });
      });
      const files = fs.readdirSync(tmp);
      assert.strictEqual(files.length, 0);
    } finally {
      fs.rmdirSync(tmp);
    }
  });

  it('My self - so no component must be found - outdir must be created', async () => {
    const tmp = path.join(tmpdir(), `aurelia-docgen-${Date.now()}`);
    try {
      const logs: string[] = [];
      const errors: Error[] = [];
      await new Promise<void>((resolve, reject) => {
        const worker = new Worker(path.join(process.cwd(), './src/cli.worker.js'), {
          argv: ['--out', tmp],
          env: process.env,
        });
        worker.on('message', data => logs.push(data));
        worker.on('error', data => errors.push(data));
        worker.on('exit', code => {
          if (code !== 0) {
            console.log(errors);
            reject(new Error(`Worker stopped with exit code ${code}`));
          } else {
            resolve();
          }
        });
      });
      const files = fs.readdirSync(tmp);
      assert.strictEqual(files.length, 0);
    } finally {
      fs.rmdirSync(tmp);
    }
  });

  it('My self - so no component must be found - specified cwd', async () => {
    const tmp = path.join(tmpdir(), `aurelia-docgen-${Date.now()}`);
    try {
      fs.mkdirSync(tmp);
      const logs: string[] = [];
      const errors: Error[] = [];
      await new Promise<void>((resolve, reject) => {
        const worker = new Worker(path.join(process.cwd(), './src/cli.worker.js'), {
          argv: ['--projectDir', process.cwd(), '--out', tmp],
          env: process.env,
        });
        worker.on('message', data => logs.push(data));
        worker.on('error', data => errors.push(data));
        worker.on('exit', code => {
          if (code !== 0) {
            console.log(errors);
            reject(new Error(`Worker stopped with exit code ${code}`));
          } else {
            resolve();
          }
        });
      });
      const files = fs.readdirSync(tmp);
      assert.strictEqual(files.length, 0);
    } finally {
      fs.rmdirSync(tmp);
    }
  });

  it('Project AU2 Basic - components must be found', async () => {
    const tmp = path.join(tmpdir(), `aurelia-docgen-${Date.now()}`);
    try {
      fs.mkdirSync(tmp);
      const logs: string[] = [];
      const errors: Error[] = [];
      await new Promise<void>((resolve, reject) => {
        const worker = new Worker(path.join(process.cwd(), './src/cli.worker.js'), {
          argv: ['--projectDir', path.join(process.cwd(), 'examples', 'au2-basic'), '--out', tmp],
          env: process.env,
        });
        worker.on('message', data => logs.push(data));
        worker.on('error', data => errors.push(data));
        worker.on('exit', code => {
          if (code !== 0) {
            console.log(errors);
            reject(new Error(`Worker stopped with exit code ${code}`));
          } else {
            resolve();
          }
        });
      });
      const files = fs.readdirSync(tmp);
      files.sort((a, b) => a.localeCompare(b));
      assert.strictEqual(files.length, 8);
      assert.strictEqual(files[0], 'au2-button.stories.ts');
      assert.strictEqual(files[1], 'au2-countdown.stories.ts');
      assert.strictEqual(files[2], 'au2-empty.stories.ts');
      assert.strictEqual(files[3], 'au2-just-for-test.stories.ts');
      assert.strictEqual(files[4], 'doSomething.stories.ts');
      assert.strictEqual(files[5], 'log.stories.ts');
      assert.strictEqual(files[6], 'MyService.stories.ts');
      assert.strictEqual(files[7], 'red-square.stories.ts');
    } finally {
      fs.rmSync(tmp, {
        recursive: true,
        force: true,
      });
    }
  });

  it('Project AU2 Basic - DRY - components must be found', async () => {
    const projectDir = path.join(process.cwd(), 'examples', 'au2-basic');
    await new Promise<void>((resolve, reject) => {
      const worker = new Worker(path.join(process.cwd(), './src/cli.worker.js'), {
        argv: ['--projectDir', projectDir],
        env: process.env,
      });
      worker.on('exit', code => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        } else {
          resolve();
        }
      });
    });
    assert.ok(fs.existsSync(path.join(projectDir, 'src', 'components', 'au2-button.stories.ts')));
    assert.ok(fs.existsSync(path.join(projectDir, 'src', 'components', 'au2-countdown.stories.ts')));
    assert.ok(fs.existsSync(path.join(projectDir, 'src', 'components', 'au2-empty.stories.ts')));
  });

  it('Watch Project AU2 Basic - components must be found', async () => {
    const tmp = path.join(tmpdir(), `aurelia-docgen-${Date.now()}`);
    const projectDir = path.join(process.cwd(), 'examples', 'au2-basic');
    const tmpNewFile = path.join(projectDir, 'src', '_move_.txt');
    const tmpNewFile2 = path.join(projectDir, 'src', '_move_2.txt');
    ensureUnlink(tmpNewFile);
    ensureUnlink(tmpNewFile2);

    try {
      let i = 0;
      fs.mkdirSync(tmp);
      const errors: Error[] = [];
      await new Promise<void>((resolve, reject) => {
        const worker = new Worker(path.join(process.cwd(), './src/cli.worker.js'), {
          argv: ['--projectDir', projectDir, '--out', tmp, '--watch'],
          env: process.env,
        });
        worker.on('message', message => {
          if (message === AureliaDocgenCLI.MSG_WATCHING) {
            fs.writeFileSync(tmpNewFile, "c'est parti", 'utf-8');
            fs.writeFileSync(tmpNewFile2, "c'est parti 2", 'utf-8');
          } else if (message === AureliaDocgenCLI.MSG_WRITE_STORIES_DONE) {
            i++;
            if (i > 1) {
              worker.postMessage(AureliaDocgenCLI.MSG_EXIT);
            }
          }
        });
        worker.on('error', data => errors.push(data));
        worker.on('exit', code => {
          if (code !== 0) {
            console.log(errors);
            reject(new Error(`Worker stopped with exit code ${code}`));
          } else {
            resolve();
          }
        });
      });
      assert.strictEqual(i, 2);
      const files = fs.readdirSync(tmp);
      files.sort((a, b) => a.localeCompare(b));
      assert.strictEqual(files.length, 8);
      assert.strictEqual(files[0], 'au2-button.stories.ts');
      assert.strictEqual(files[1], 'au2-countdown.stories.ts');
      assert.strictEqual(files[2], 'au2-empty.stories.ts');
      assert.strictEqual(files[3], 'au2-just-for-test.stories.ts');
      assert.strictEqual(files[4], 'doSomething.stories.ts');
      assert.strictEqual(files[5], 'log.stories.ts');
      assert.strictEqual(files[6], 'MyService.stories.ts');
      assert.strictEqual(files[7], 'red-square.stories.ts');
    } finally {
      fs.rmSync(tmp, {
        recursive: true,
        force: true,
      });
      ensureUnlink(tmpNewFile);
      ensureUnlink(tmpNewFile2);
    }
  });

  it('Project AU2 Basic - Merge all', async () => {
    const tmp = path.join(tmpdir(), `aurelia-docgen-${Date.now()}`);
    try {
      fs.mkdirSync(tmp);
      const logs: string[] = [];
      const errors: Error[] = [];
      await new Promise<void>((resolve, reject) => {
        const worker = new Worker(path.join(process.cwd(), './src/cli.worker.js'), {
          argv: ['--projectDir', path.join(process.cwd(), 'examples', 'au2-basic'), '--out', tmp, '--mergeOut', '--etaTemplate', path.join(process.cwd(), 'static', 'templates', 'common.stories.md.eta')],
          env: process.env,
        });
        worker.on('message', data => logs.push(data));
        worker.on('error', data => errors.push(data));
        worker.on('exit', code => {
          if (code !== 0) {
            console.log(errors);
            reject(new Error(`Worker stopped with exit code ${code}`));
          } else {
            resolve();
          }
        });
      });
      const files = fs.readdirSync(tmp);
      assert.strictEqual(files.length, 1);
      assert.strictEqual(files[0], 'components.stories.md');
    } finally {
      fs.rmSync(tmp, {
        recursive: true,
        force: true,
      });
    }
  });

  it('Process, lifecycle', async () => {
    const tmp = path.join(tmpdir(), `aurelia-docgen-${Date.now()}`);
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
    const tmp = path.join(tmpdir(), `aurelia-docgen-${Date.now()}`);
    try {
      fs.mkdirSync(tmp);
      await new Promise<void>((resolve, reject) => {
        const spawnProc = spawn(`node`, [path.join(process.cwd(), './src/cli.worker.js'), '--watch', '--projectDir', process.cwd(), '--out', tmp], { cwd: process.cwd(), stdio: ['inherit', 'inherit', 'inherit', 'ipc'] });
        spawnProc.on('message', msg => {
          if (msg === AureliaDocgenCLI.MSG_WATCHING) {
            const files = fs.readdirSync(tmp);
            assert.strictEqual(files.length, 0);
            spawnProc.send(AureliaDocgenCLI.MSG_EXIT);
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
