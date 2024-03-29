[![npm version](https://img.shields.io/npm/v/@creadigme/aurelia-docgen.svg)](https://www.npmjs.com/package/@creadigme/aurelia-docgen)
[![Build Status](https://github.com/creadigme/aurelia-docgen/actions/workflows/ci.yml/badge.svg)](https://github.com/creadigme/aurelia-docgen/actions)
[![CodeQL](https://github.com/creadigme/aurelia-docgen/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/creadigme/aurelia-docgen/actions/workflows/codeql-analysis.yml)
[![codecov](https://codecov.io/gh/creadigme/aurelia-docgen/branch/main/graph/badge.svg?token=BV2ZP1FH6K)](https://codecov.io/gh/creadigme/aurelia-docgen)
[![License Badge](https://img.shields.io/badge/License-AGPL%203%2B-blue.svg)](LICENSE)
<br />

# Aurelia Docgen | @creadigme/aurelia-docgen

> Aurelia + Storybook (*can be*) ❤

`Aurelia Docgen` brings the ability to **generate** component<sup>1</sup> documentations, **stories**, from *any*<sup>2</sup> `Aurelia`<sup>3</sup> `TypeScript` project.
Component's stories are written in class comments `@story` or in [YAML](https://yaml.org/) files.

This tool is intended to be used with projects based on [Aurelia framework](https://aurelia.io/)<sup>3</sup> + [Storybook](https://storybook.js.org). It could also work with projects using only `Aurelia` **without** `Storybook`.

[![aurelia logo](https://aurelia.io/styles/images/logo.svg "Aurelia")](https://aurelia.io/)

[![storybook logo](https://storybook.js.org/showcase/images/logos/storybookLogo.svg "Storybook")](https://storybook.js.org)


<sup>1. `customElement`, `valueConverter`, `customAttribute`, `bindingBehavior` and services.</sup><br>
<sup>2. Without any warranty.</sup><br>
<sup>3. ⚠️ Aurelia 1 support is not implemented yet.</sup>

## 📝 License

Copyright © 2022-2023 [Creadigme](https://www.creadigme.net).

**Disclaimer**

This project has a dual license:
- The **AGPLv3** License - see the [LICENSE file](LICENSE) for details.
- A private license agreement for private or/and commercial use.

See [the FAQ on licensing](https://github.com/creadigme/aurelia-docgen/wiki/License-FAQ#faq).

Do not hesitate to [contact us](https://creadigme.net/contact/).

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

### Aurelia Docgen

```bash
npm i @creadigme/aurelia-docgen@^2 -D
# or
yarn add @creadigme/aurelia-docgen@^2 -D
# or for global use
yarn add @creadigme/aurelia-docgen@^2 -g
```

### Storybook (*version 6*)

#### Storybook for HTML (if needed)
[Storybook for HTML](https://storybook.js.org/docs/html/get-started/install)

```bash
# Aurelia 2 project with webpack
npx sb init --type html --builder webpack5
```

#### Webpack configuration

> `./webpack.config.js`

Storybook and Aurelia use **HMR** (Hot Module Replacement), we have to disable Aurelia HMR if Storybook is used.

In your project, edit this file: `./webpack.config.js`.

**Example**: [webpack.config.js](./examples/au2-basic/webpack.config.js)

```diff
/** Your content */

- module.exports = function(env, { analyze }) {
+ module.exports = function(env, { analyze, hmr }) {

/** Your content */

{ test: /\.ts$/i, use: ['ts-loader', 
- '@aurelia/webpack-loader'
+ {
+   loader: '@aurelia/webpack-loader',
+   options: {
+     hmr: hmr === false ? false : undefined,
+   },
+ }
], exclude: /node_modules/ },
{
  test: /[/\\]src[/\\].+\.html$/i,
- use: '@aurelia/webpack-loader',
+ use: {
+   loader: '@aurelia/webpack-loader',
+   options: {
+     hmr: hmr === false ? false : undefined,
+   },
+ },

/** Your content */
```

> `./.storybook/main.js`

Storybook must use Aurelia configuration. In your project, edit this file: `./.storybook/main.js`.

**Example**: [main.js](./examples/au2-basic/.storybook/main.js)

```diff
+ const customWP = require('../webpack.config.js');

module.exports = {
+ webpackFinal: async (config) => {
+   const customConfigs = customWP(config.mode, {
+     hmr: false
+   });
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
   * @inheritDoc
   */
  public running: boolean = false;

  /**
   * @inheritDoc
   */
  public start(): void {
    this.running = true;
  }

  /**
   * @inheritDoc
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
    <au2-button action.bind="() => state = !state" content="${state ? 'Turn me off' : 'Turn me on'}"></au2-button>
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
    <au2-button action.bind="() => state = !state" content="${state ? '✅' : '☐'}"></au2-button>
    <div>${state ? '✅' : '☐' }</div>
```

## 🔨 How to use

### **(optional)** Add script in your package.json

```diff
{
  "name": "something",
  "scripts": {
+   "build:stories": "aurelia-docgen --out ./src/stories"
!   "build:stories": "aurelia-docgen"
!   "build:stories": "aurelia-docgen --out ./src/stories --auConfigure ./src/configure"
  }
}
```

### Default way - All component stories in one directory

```bash
# Go to your project
cd ./my-supra-project

# add a new script in package.json, like `build:stories` with command
# aurelia-docgen --out ./src/stories
npm run build:stories

# all detect components and stories will be written in ./src/stories directory.
```

### DRY way - Component stories next to components

```bash
# add a new script in package.json, like `build:stories` with command
# aurelia-docgen
npm run build:stories

# all detected components and the stories will be written next to the detected components.
```

### Real world installation

- Install `@creadigme/aurelia-docgen` in [`devDependencies`](#aurelia-docgen).
- Script on `package.json` as below.
- All component stories in one directory.
- Storybook stories can use any register elements.
- `./.storybook/main.js` is edited with [webpack configuration](#webpack-configuration).

**./package.json**
```diff
{
  "name": "something",
  "scripts": {
+   "build:stories": "aurelia-docgen --out ./src/stories --auConfigure ./src/configure"
+   "watch:stories": "npm run build:stories -- --watch"
  },
  "devDependencies": {
+   "@creadigme/aurelia-docgen": "^1"
  }
}
```

**./src/configure.ts**
```typescript
import { Aurelia, Registration, type IEnhancementConfig, type IHydratedParentController } from "aurelia";

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

let lastController: ICustomElementController<unknown>;

/** Cleanup previous story and enhance current */
export async function enhance(aureliaInst: Aurelia, config: IEnhancementConfig<unknown>, parentController?: IHydratedParentController | null): Promise<ICustomElementController<unknown>> {
  if (lastController) {
    // detaching, unbinding
    await lastController.deactivate(lastController, null);
    // dispose
    await lastController.dispose();
  }

  lastController = await aureliaInst.enhance(config, parentController);
  return lastController;
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
import { AureliaDocgen } from '@creadigme/aurelia-docgen';

const au2Docgen = new AureliaDocgen({
  projectDir: './path-of-your-supra-ultra-project',
  out: './src/stories',
});

for (const ceStories of au2Docgen.getStories()) {
  console.dir(ceStories);
}
```


## Coverage
[![codecov](https://codecov.io/gh/creadigme/aurelia-docgen/branch/main/graph/badge.svg?token=BV2ZP1FH6K)](https://codecov.io/gh/creadigme/aurelia-docgen)

![Coverage sunburst](https://codecov.io/gh/creadigme/aurelia-docgen/branch/main/graphs/sunburst.svg?token=BV2ZP1FH6K)
