import * as assert from 'assert';
import * as path from 'path';
import type { LogLevel } from 'typedoc';
import { AureliaDocgen } from './aurelia-docgen';

describe('aurelia-docgen', () => {
  it('My self - so no component must be found', () => {
    const logs: Array<{ msg: string; level: LogLevel }> = [];
    const aureliaDocgen = new AureliaDocgen({
      logger: (msg, level) => logs.push({ msg, level }),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const ceStories of aureliaDocgen.getStories()) {
      assert.fail('No component must be found');
    }

    assert.strictEqual(logs.length, 0);
  });

  it('My self - so no component must be found - cwd specified', () => {
    const logs: Array<{ msg: string; level: LogLevel }> = [];
    const aureliaDocgen = new AureliaDocgen({
      projectDir: process.cwd(),
      logger: (msg, level) => logs.push({ msg, level }),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const ceStories of aureliaDocgen.getStories()) {
      assert.fail('No component must be found');
    }

    assert.strictEqual(logs.length, 0);
  });

  it('My self verbose with default logger', () => {
    const aureliaDocgen = new AureliaDocgen({
      projectDir: process.cwd(),
      verbose: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const ceStories of aureliaDocgen.getStories()) {
      assert.fail('No component must be found');
    }
  });

  it('My self verbose - so no component must be found', () => {
    const logs: Array<{ msg: string; level: LogLevel }> = [];
    const aureliaDocgen = new AureliaDocgen({
      projectDir: process.cwd(),
      verbose: true,
      logger: (msg, level) => logs.push({ msg, level }),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const ceStories of aureliaDocgen.getStories()) {
      assert.fail('No component must be found');
    }

    assert.strictEqual(logs.length, 7);
  });

  it('Project AU2 Basic - components must be found', () => {
    const aureliaDocgen = new AureliaDocgen({
      projectDir: path.join(process.cwd(), 'examples', 'au2-basic'),
    });

    const stories = Array.from(aureliaDocgen.getStories());
    assert.strictEqual(stories.length, 8);

    // AU2 Button
    assert.strictEqual(stories[2].component.tag, 'au2-button');
    assert.strictEqual(stories[2].component.bindables.length, 3);
    assert.strictEqual(stories[2].component.publicMethods.length, 0);
    assert.ok(stories[2].stories.indexOf("import Aurelia from 'aurelia';") !== -1);
    assert.ok(stories[2].stories.indexOf("import { Au2Button } from './au2-button';") !== -1);
    assert.ok(stories[2].stories.indexOf("title: 'components/au2-button'") !== -1);
    assert.ok(
      stories[2].stories.indexOf(
        `action: {\n      type: \"object\",\n      control: false,\n      description: \"Action\\n\\n🔖 **action**\",\n      original: \"reflection\",\n      defaultValue: undefined,\n      table: {\n        category: 'Bindables',\n      },\n    },`
      ) !== -1
    );
    assert.ok(
      stories[2].stories.indexOf(
        `content: {\n      type: \"string\",\n      control: \"text\",\n      original: {\"name\":\"string\",\"type\":\"intrinsic\"},\n      defaultValue: 'Click me',\n      description: \"Content of button\",\n      table: {\n        category: 'Bindables',\n      },\n    },`
      ) !== -1
    );
    assert.ok(
      stories[2].stories.indexOf(
        `style: {\n      type: \"string\",\n      control: \"text\",\n      original: {\"name\":\"string\",\"type\":\"intrinsic\"},\n      defaultValue: undefined,\n      description: \"Style of button\",\n      table: {\n        category: 'Bindables',\n      },\n    },`
      ) !== -1
    );
    assert.ok(stories[2].stories.indexOf('export const DefaultUsage = Template.bind({});') !== -1);
    assert.ok(stories[2].stories.indexOf("DefaultUsage.storyName = 'Default usage'") !== -1);
    assert.ok(stories[2].stories.indexOf("I'm not a button") !== -1);
    assert.ok(stories[2].stories.indexOf('export const story0 = RawTemplate.bind({});') !== -1);
    assert.ok(stories[2].stories.indexOf('story0.storyName = "Toggle";') !== -1);
    assert.ok(stories[2].stories.indexOf('story: "`button` `simple`\\n" + "A button toggle\\n"') !== -1);

    // AU2 Countdown
    assert.strictEqual(stories[3].component.tag, 'au2-countdown');
    assert.strictEqual(stories[3].component.bindables.length, 4);
    assert.strictEqual(stories[3].component.publicMethods.length, 2);
    assert.strictEqual(stories[3].component.publicMethods[0].name, 'start');
    assert.strictEqual(stories[3].component.publicMethods[1].name, 'stop');
    assert.strictEqual(stories[3].component.stories.length, 2);
    assert.strictEqual(stories[3].component.stories[0].title, 'My story');
    assert.strictEqual(stories[3].component.stories[0].code, '<au2-countdown start-value.bind="100"></<au2-countdown>');
    assert.strictEqual(stories[3].component.stories[1].title, 'My another story');
    assert.strictEqual(stories[3].component.stories[1].code, '<au2-countdown start-value.bind="200"></<au2-countdown>');

    // AU2 Empty
    assert.strictEqual(stories[4].component.tag, 'au2-empty');
    assert.strictEqual(stories[4].component.bindables.length, 0);
    assert.strictEqual(stories[4].component.publicMethods.length, 0);

    // AU2 just for test
    assert.strictEqual(stories[5].component.tag, 'au2-just-for-test');
    assert.strictEqual(stories[5].component.bindables.length, 9);
    assert.ok(stories[5].component.bindables.find(f => f.name === 'isEnabled'));
  });

  it('Project AU2 Basic - custom Eta template', () => {
    const aureliaDocgen = new AureliaDocgen({
      projectDir: path.join(process.cwd(), 'examples', 'au2-basic'),
      etaTemplate: path.join(process.cwd(), 'static', 'templates', 'common.stories.md.eta'),
    });

    const stories = Array.from(aureliaDocgen.getStories());
    assert.strictEqual(stories.length, 8);

    // AU2 Button
    assert.strictEqual(stories[2].component.tag, 'au2-button');
    assert.strictEqual(stories[2].component.bindables.length, 3);
    assert.strictEqual(stories[2].component.publicMethods.length, 0);
    assert.ok(stories[2].stories.indexOf('# components/au2-button') !== -1);
    assert.ok(stories[2].stories.indexOf("> I'm not a button") !== -1);
    assert.ok(stories[2].stories.indexOf('## Stories') !== -1);
    assert.ok(stories[2].stories.indexOf('### Toggle') !== -1);
  });

  it('Project AU2 Basic - auConfigure', () => {
    const aureliaDocgen = new AureliaDocgen({
      projectDir: path.join(process.cwd(), 'examples', 'au2-basic'),
      auConfigure: './src/configure',
    });

    const stories = Array.from(aureliaDocgen.getStories());
    assert.strictEqual(stories.length, 8);

    assert.ok(stories[0].stories.indexOf("import * as configure from './../configure';") !== -1);
    assert.ok(stories[0].stories.indexOf('$au: await configure.getOrCreateAurelia(),') !== -1);
    assert.ok(stories[1].stories.indexOf("import * as configure from './../configure';") !== -1);
    assert.ok(stories[1].stories.indexOf('$au: await configure.getOrCreateAurelia(),') !== -1);
    assert.ok(stories[2].stories.indexOf("import * as configure from './../configure';") !== -1);
    assert.ok(stories[2].stories.indexOf('$au: await configure.getOrCreateAurelia(),') !== -1);
  });
});
