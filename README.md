[![npm version](https://img.shields.io/npm/v/@creadigme/aurelia-stories.svg)](https://www.npmjs.com/package/@creadigme/aurelia-stories)
[![Build Status](https://github.com/creadigme/aurelia-stories/actions/workflows/ci.yml/badge.svg)](https://github.com/creadigme/aurelia-stories/actions)
[![codecov](https://codecov.io/gh/creadigme/aurelia-stories/branch/master/graph/badge.svg?token=BV2ZP1FH6K)](https://codecov.io/gh/creadigme/aurelia-stories)
[![License Badge](https://img.shields.io/badge/License-AGPL%203%2B-blue.svg)](LICENSE)
<br />

# Aurelia Stories | @creadigme/aurelia-stories

> Aurelia + Storybook (*can be*) ❤

`Aurelia Stories` brings the ability to generate component documentations, **stories**, from *any*<sup>1</sup> `Aurelia` `TypeScript` project.
Components's stories are written in [YAML](https://yaml.org/).

This tool is intended to be used with projects based on [Aurelia framework](https://aurelia.io/)<sup>2</sup> + [Storybook](https://storybook.js.org). It could also work with projects using only `Aurelia` **without** `Storybook`.

[![aurelia logo](https://aurelia.io/styles/images/logo.svg "Aurelia")](https://aurelia.io/)

[![storybook logo](https://storybook.js.org/showcase/images/logos/storybookLogo.svg "Storybook")](https://storybook.js.org)

<sup>1. Without any warranty.</sup><br>
<sup>2. ⚠️ Aurelia 1 support is not implemented yet.</sup>
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

## Installation

### Aurelia Stories

```bash
npm i @creadigme/aurelia-stories -D
# or
yarn add @creadigme/aurelia-stories -D
# or for global use
yarn add @creadigme/aurelia-stories -g
```

### Storybook

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

## Write stories

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

## CLI

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

### API Parameters

[CLI Parameters](#cli-parameters) + below:

| Parameter | Description | Sample |
|---|---|---|
| logger | `(msg: string, level: LevelLog) => void` | `console.log(``${level} - ${msg}``)` |

```typescript
import { AU2Storybook } from './aurelia-stories';

const au2Storybook = new AU2Storybook({
  projectDir: './path-of-your-supra-ultra-project',
  out: './src/stories',
});

for (const ceStories of this._au2Storybook.getStories()) {
  console.dir(ceStories);
}
```

# Coverage
[![codecov](https://codecov.io/gh/creadigme/aurelia-stories/branch/master/graph/badge.svg?token=BV2ZP1FH6K)](https://codecov.io/gh/creadigme/aurelia-stories)

![Coverage sunburst](https://codecov.io/gh/creadigme/aurelia-stories/branch/master/graphs/sunburst.svg?token=BV2ZP1FH6K)
