import * as assert from 'assert';
import * as path from 'path';
import type { LogLevel } from 'typedoc';
import { AureliaStories } from './aurelia-stories';

describe('aurelia-stories', () => {
  it('My self - so no component must be found', () => {
    const logs: Array<{ msg: string; level: LogLevel }> = [];
    const aureliaStories = new AureliaStories({
      logger: (msg, level) => logs.push({ msg, level }),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const ceStories of aureliaStories.getStories()) {
      assert.fail('No component must be found');
    }

    assert.strictEqual(logs.length, 0);
  });

  it('My self - so no component must be found - cwd specified', () => {
    const logs: Array<{ msg: string; level: LogLevel }> = [];
    const aureliaStories = new AureliaStories({
      cwd: process.cwd(),
      logger: (msg, level) => logs.push({ msg, level }),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const ceStories of aureliaStories.getStories()) {
      assert.fail('No component must be found');
    }

    assert.strictEqual(logs.length, 0);
  });

  it('My self verbose with default logger', () => {
    const aureliaStories = new AureliaStories({
      cwd: process.cwd(),
      verbose: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const ceStories of aureliaStories.getStories()) {
      assert.fail('No component must be found');
    }
  });

  it('My self verbose - so no component must be found', () => {
    const logs: Array<{ msg: string; level: LogLevel }> = [];
    const aureliaStories = new AureliaStories({
      cwd: process.cwd(),
      verbose: true,
      logger: (msg, level) => logs.push({ msg, level }),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const ceStories of aureliaStories.getStories()) {
      assert.fail('No component must be found');
    }

    assert.strictEqual(logs.length, 7);
  });

  it('Project AU2 Basic - components must be found', () => {
    const aureliaStories = new AureliaStories({
      cwd: path.join(process.cwd(), 'examples', 'au2-basic'),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const stories = Array.from(aureliaStories.getStories());
    assert.strictEqual(stories.length, 3);

    // AU2 Button
    assert.strictEqual(stories[0].component.componentTag, 'au2-button');
    assert.strictEqual(stories[0].component.bindables.length, 3);
    assert.strictEqual(stories[0].component.publicMethods.length, 0);
    assert.ok(stories[0].stories.indexOf("import Aurelia from 'aurelia';") !== -1);
    assert.ok(stories[0].stories.indexOf("import { Au2Button } from './../components/au2-button';") !== -1);
    assert.ok(stories[0].stories.indexOf("title: 'components/au2-button'") !== -1);
    assert.ok(stories[0].stories.indexOf('action: {"type":"object","control":"object","table":{"category":"Properties"}') !== -1);
    assert.ok(stories[0].stories.indexOf('content: {"type":"string","control":"text","defaultValue":"\'Click me\'","description":"Content of button","table":{"category":"Properties"}') !== -1);
    assert.ok(stories[0].stories.indexOf('style: {"type":"string","control":"text","description":"Style of button","table":{"category":"Properties"}') !== -1);
    assert.ok(stories[0].stories.indexOf('export const DefaultUsage = Template.bind({});') !== -1);
    assert.ok(stories[0].stories.indexOf("DefaultUsage.storyName = 'Default usage'") !== -1);
    assert.ok(stories[0].stories.indexOf("I'm not a button") !== -1);
    assert.ok(stories[0].stories.indexOf('export const story0 = RawTemplate.bind({});') !== -1);
    assert.ok(stories[0].stories.indexOf('story0.storyName = "Toggle";') !== -1);
    assert.ok(stories[0].stories.indexOf('story: "`button` `simple`\\n" + "A button toggle\\n"') !== -1);

    // AU2 Countdown
    assert.strictEqual(stories[1].component.componentTag, 'au2-countdown');
    assert.strictEqual(stories[1].component.bindables.length, 4);
    assert.strictEqual(stories[1].component.publicMethods.length, 2);
    assert.strictEqual(stories[1].component.publicMethods[0].name, 'start');
    assert.strictEqual(stories[1].component.publicMethods[1].name, 'stop');

    // AU2 Empty
    assert.strictEqual(stories[2].component.componentTag, 'au2-empty');
    assert.strictEqual(stories[2].component.bindables.length, 0);
    assert.strictEqual(stories[2].component.publicMethods.length, 0);
  });

  it('Project AU2 Basic - custom Eta template', () => {
    const aureliaStories = new AureliaStories({
      cwd: path.join(process.cwd(), 'examples', 'au2-basic'),
      etaTemplate: path.join(process.cwd(), 'static', 'templates', 'common.stories.md.eta'),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const stories = Array.from(aureliaStories.getStories());
    assert.strictEqual(stories.length, 3);

    // AU2 Button
    assert.strictEqual(stories[0].component.componentTag, 'au2-button');
    assert.strictEqual(stories[0].component.bindables.length, 3);
    assert.strictEqual(stories[0].component.publicMethods.length, 0);
    assert.ok(stories[0].stories.indexOf('# Au2Button') !== -1);
    assert.ok(stories[0].stories.indexOf("> I'm not a button") !== -1);
    assert.ok(stories[0].stories.indexOf('## Stories') !== -1);
    assert.ok(stories[0].stories.indexOf('### Toggle') !== -1);
  });
});
