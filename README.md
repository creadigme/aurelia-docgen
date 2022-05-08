[![npm version](https://img.shields.io/npm/v/@creadigme/aurelia-stories.svg)](https://www.npmjs.com/package/@creadigme/aurelia-stories)
[![Build Status](https://github.com/creadigme/aurelia-stories/actions/workflows/ci.yml/badge.svg)](https://github.com/creadigme/aurelia-stories/actions)
[![CodeQL](https://github.com/creadigme/aurelia-stories/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/creadigme/aurelia-stories/actions/workflows/codeql-analysis.yml)
[![codecov](https://codecov.io/gh/creadigme/aurelia-stories/branch/main/graph/badge.svg?token=BV2ZP1FH6K)](https://codecov.io/gh/creadigme/aurelia-stories)
[![License Badge](https://img.shields.io/badge/License-AGPL%203%2B-blue.svg)](LICENSE)
<br />

# Aurelia Stories | @creadigme/aurelia-stories

> Aurelia + Storybook (*can be*) ❤

`Aurelia Stories` brings the ability to **generate** component<sup>1</sup> documentations, **stories**, from *any*<sup>2</sup> `Aurelia` `TypeScript` project.
Component's stories are written in class comments `@story` or in [YAML](https://yaml.org/) files.

This tool is intended to be used with projects based on [Aurelia framework](https://aurelia.io/)<sup>3</sup> + [Storybook](https://storybook.js.org). It could also work with projects using only `Aurelia` **without** `Storybook`.

[![aurelia logo](https://aurelia.io/styles/images/logo.svg "Aurelia")](https://aurelia.io/)

[![storybook logo](https://storybook.js.org/showcase/images/logos/storybookLogo.svg "Storybook")](https://storybook.js.org)


<sup>1. `customElement`, `valueConverter`, `customAttribute`, `bindingBehavior` and services.</sup><br>
<sup>2. Without any warranty.</sup><br>
<sup>3. ⚠️ Aurelia 1 support is not implemented yet.</sup>

## 📝 License

Copyright © 2022 [Creadigme](https://www.creadigme.net).

**Disclaimer**

This project has a dual license:
- The **AGPLv3** License - see the [LICENSE file](LICENSE) for details.
- An OEM / private license agreement for private or/and commercial use.

See [the FAQ on licensing.](#license-faq).

Do not hesitate to contact us.

<!--
> [AD]
> 
> An issue with your Aurelia project? *(Architecture, component, compatibility, performance...)*
> A request concerning an Aurelia project?
> 
> Do not hesitate to contact us via this form, we can certainly help you.
> 
> [/AD]
-->

## 💾 Installation

### Aurelia Stories

```bash
npm i @creadigme/aurelia-stories -D
# or
yarn add @creadigme/aurelia-stories -D
# or for global use
yarn add @creadigme/aurelia-stories -g
```

### Storybook (*version 6*)

#### Storybook for HTML (if needed)
[Storybook for HTML](https://storybook.js.org/docs/html/get-started/install)

```bash
# Aurelia 2 project with webpack
npx sb init --type html --builder webpack5
```

#### Webpack configuration

In your project, edit this file: `./.storybook/main.js`.

```diff
+ const customWP = require('../webpack.config.js');

module.exports = {
+ webpackFinal: async (config) => {
+   const customConfigs = customWP(config.mode, {});
+   return {
+     ...config,
+     module: {
+       ...config.module,
+       rules: (Array.isArray(customConfigs) ? customConfigs[0] : customConfigs).module.rules
+     }
+   };
+ },
+ core: {
+   builder: 'webpack5',
+ },
  "stories": [
-   "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  "framework": "@storybook/html",
  "core": {
    "builder": "@storybook/builder-webpack5"
  }
}
```

> ⚠️ Currently we do not support .mdx stories.

## 📝 Write stories

> **TLDR;** comment your class with `@story` **or**/**and** via YAML files.

### Comment your class `@story`

Just like that:

#### `customElement`

```typescript
/**
 * My component
 *
 * @story My story
 * ```html
 * <au-component value.bind="1"></<au-component>
 * ```
 *
 * @story My another story
 * ```html
 * <au-component value.bind="200"></<au-component>
 * ```
 */
@customElement('au-component')
export class AuComponent implements ICustomElementViewModel {
  /** ... */
  @bindable()
  public value = 1;
}
```

#### `valueConverter`

```typescript
/**
 * My converter
 *
 * @example
 * ```html
 * <!-- it's the default usage for valueConverter ! -->
 * <span>${ '1' | doSomething}</span>
 * ```
 *
 * @story My story
 * ```html
 * <let my-value.bind="{ a: 1 }">
 * <span>${ myValue | doSomething}</span>
 * ```
 *
 * @story My another story
 * ```html
 * <let my-value.bind="{ a: 1, b: 2 }">
 * <span>${ myValue | doSomething}</span>
 * ```
 */
@valueConverter('doSomething')
export class DoSomethingValueConverter {
  public toView(value: string | Record<string, number>): string {
    return /* ?? */ 'ok';
  }
}
```

#### `customAttribute`

```typescript
import { customAttribute, INode } from 'aurelia';

/**
 * Red Square
 * From https://docs.aurelia.io/getting-to-know-aurelia/custom-attributes#attribute-aliases
 *
 * @group attributes/red-square
 */
@customAttribute({ name: 'red-square', aliases: ['redify', 'redbox'] }) 
export class RedSquareCustomAttribute {
  constructor(@INode private element: HTMLElement){
      this.element.style.width = this.element.style.height = '100px';
      this.element.style.backgroundColor = 'red';
  }
}
```

#### `bindingBehavior`

```typescript
import { ILogger, bindingBehavior } from 'aurelia';

/**
 * Log behavior
 *
 * @group binding-behavior/log
 */
@bindingBehavior('log')
export class Log {
  constructor(
    @ILogger readonly logger: ILogger,
  ) {}
  bind(...args) {
    this.logger.debug('bind', ...args);
  }
  unbind(...args) {
    this.logger.debug('unbind', ...args);
  }
}
```

#### `service`

The tag comment `@service` is the key.

```typescript
/**
 * My Service
 *
 * @service
 */
export class MyService implements IMyService {
  /**
   * @inheritdoc
   */
  public running: boolean = false;

  /**
   * @inheritdoc
   */
  public start(): void {
    this.running = true;
  }

  /**
   * @inheritdoc
   */
   public stop(): void {
    this.running = false;
  }
}
```

### YAML Way

Stories are written in [YAML](https://yaml.org/) next to components like these:

```diff
 components
 ├── something
 │   ├── au2-button.html
 │   ├── au2-button.ts
+│   ├── au2-button.stories.yml
 │   ├── au2-switch.html
 │   ├── au2-switch.ts
+│   ├── au2-switch.stories.yml
 └── else
 │   ├── supra-ultra-component.html
 │   ├── supra-ultra-component.ts
+│   ├── supra-ultra-component.stories.yml
```

With this format:

```yml
# au2-button stories
- title: Toggle
  help: |
    A button toggle
  tags:
    - button
    - simple
  code: |
    <let state.bind="false"></let>
    <au2-button action.call="state = !state" content="${state ? 'Turn me off' : 'Turn me on'}"></au2-button>
    <div>${state ? '✅' : '☐' }</div>
- title: Another story
  help: |
    Another story. Look at this sample...
  tags:
    - button
    - simple
    - supra
  code: |
    <let state.bind="false"></let>
    <au2-button action.call="state = !state" content="${state ? '✅' : '☐'}"></au2-button>
    <div>${state ? '✅' : '☐' }</div>
```

## 🔨 How to use

### **(optional)** Add script in your package.json

```diff
{
  "name": "something",
  "scripts": {
+   "build:stories": "aurelia-stories --out ./src/stories"
!   "build:stories": "aurelia-stories"
!   "build:stories": "aurelia-stories --out ./src/stories --auConfigure ./src/configure"
  }
}
```

### Default way - All component stories in one directory

```bash
# Go to your project
cd ./my-supra-project

# add a new script in package.json, like `build:stories` with command
# aurelia-stories --out ./src/stories
npm run build:stories

# all detect components and stories will be written in ./src/stories directory.
```

### DRY way - Component stories next to components

```bash
# add a new script in package.json, like `build:stories` with command
# aurelia-stories
npm run build:stories

# all detected components and the stories will be written next to the detected components.
```

### Real world installation

- Install `@creadigme/aurelia-stories` in [`devDependencies`](#aurelia-stories).
- Script on `package.json` as below.
- All component stories in one directory.
- Storybook stories can use any register elements.
- `./.storybook/main.js` is edited with [webpack configuration](#webpack-configuration).

**./package.json**
```diff
{
  "name": "something",
  "scripts": {
+   "build:stories": "aurelia-stories --out ./src/stories --auConfigure ./src/configure"
+   "watch:stories": "npm run build:stories -- --watch"
  },
  "devDependencies": {
+   "@creadigme/aurelia-stories": "^1"
  }
}
```

**./src/configure.ts**
```typescript
/** It's just an example */
let au: Aurelia;

/**
 * If specified, this function is called to retrieve the instance of Aurelia
 * @return Aurelia
 */
export async function getOrCreateAurelia(): Promise<Aurelia> {
  if (!au) {
    au = new Aurelia().register(/** Your configuration */);
    // Do your specific stuff here
  }
  return au;
}
```

```bash
npm run build:stories
# all detect components and stories will be written in ./src/stories directory.
```

```bash
# launch storybook
npm run storybook
```

### CLI parameters

| Parameter | Description | Sample |
|---|---|---|
| --projectDir | Project directory. *Current working directory is used by default.* | `./` |
| --out | Output directory for generated stories. *If not specified, stories are written next to the components.* | `./src/stories/` |
| --mergeOut | If `out` is specified, merges the component stories into a single file | `./src/stories/components.stories.ts` |
| --auConfigure | Specify the TS file for Aurelia configuration (**without extension**).<br><br>Example `./src/configure` file:<br>`export async function getOrCreateAurelia(): Promise<Aurelia> { return Aurelia.register(/** */); }`.<br> *If null or empty, only the current component will be register.* | |
| --etaTemplate | Path of Eta template (https://eta.js.org/). *If null, the default template is used* | |
| --verbose | More logs | |
| --watch | Monitor changes | |

### API Parameters

[CLI Parameters](#cli-parameters) + below:

| Parameter | Description | Sample |
|---|---|---|
| logger | `(msg: string, level: LevelLog) => void` | `console.log(``${level} - ${msg}``)` |

```typescript
import { AU2Storybook } from '@creadigme/aurelia-stories';

const au2Storybook = new AU2Storybook({
  projectDir: './path-of-your-supra-ultra-project',
  out: './src/stories',
});

for (const ceStories of this._au2Storybook.getStories()) {
  console.dir(ceStories);
}
```

## License FAQ

### Can I use this project with my **AGPLv3** project ?
Yes

### Can I use this project with my commercial **AGPLv3** project ?
Yes

### Can I use this project with my private project ?
Yes, with an OEM / private license agreement, contact us.

### Can I use this project with my private commercial project ?
Yes, with an OEM / private license agreement, contact us.


## Coverage
[![codecov](https://codecov.io/gh/creadigme/aurelia-stories/branch/main/graph/badge.svg?token=BV2ZP1FH6K)](https://codecov.io/gh/creadigme/aurelia-stories)

![Coverage sunburst](https://codecov.io/gh/creadigme/aurelia-stories/branch/main/graphs/sunburst.svg?token=BV2ZP1FH6K)
