[![Build Status](https://github.com/creadigme/aurelia-stories/actions/workflows/ci.yml/badge.svg)](https://github.com/creadigme/aurelia-stories/actions)
[![codecov](https://codecov.io/gh/creadigme/aurelia-stories/branch/master/graph/badge.svg?token=JNC69B3DD1)](https://codecov.io/gh/creadigme/aurelia-stories)
<br />

# Aurelia Stories | @creadigme/aurelia-stories

> Aurelia + Storybook (can be) ❤

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
# or for global usage
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

```bash
components
├── something
│   ├── au2-button.html
│   ├── au2-button.ts
│   ├── au2-button.stories.yml
│   ├── au2-switch.html
│   ├── au2-switch.ts
│   ├── au2-switch.stories.yml
└── else
│   ├── supra-ultra-component.html
│   ├── supra-ultra-component.ts
│   ├── supra-ultra-component.stories.yml
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

### Default way - All component stories in one directory

```bash
# Go to your project
cd ./my-supra-project

# add a new script in package.json, like `generate:docs` with command
aurelia-stories --out ./src/stories

# all detect components and stories will be written in ./src/stories directory.
```

### DRY way - Component stories next to components

```bash
aurelia-stories

# all detected components and the stories will be written next to the detected components.
```


### CLI parameters

| Parameter | Description | Sample | Mandatory | Multiple
|---|---|---|---|---|
| --cwd | Project directory. *Current working directory is used by default.* | `./` | false | false
| **--out** | Output directory for generated stories. *If not specified, stories are written next to the components.* | `./src/stories/` | false | false
| **--mergeOut** | If `out` is specified, merges the component stories into a single file | `./src/stories/components.stories.ts` | false | false
| --auRegister | Specify the TS file for Aurelia configuration. *If null or empty, only the current component will be register.* | | false | false
| --etaTemplate | Path of Eta template (https://eta.js.org/). *If null, the default template is used* | | false | false
| --verbose | More logs | | false | false

### API

| Parameter | Description | Sample | Mandatory | Multiple
|---|---|---|---|---|
| --cwd | Project directory. *Current working directory is used by default.* | `./` | false | false
| --auRegister | Specify the TS file for Aurelia configuration. *If null or empty, only the current component will be register.* | | false | false
| --etaTemplate | Path of Eta template (https://eta.js.org/). *If null, the default template is used* | | false | false
| --verbose | More logs | | false | false
| **--logger** | `(msg: string, level: LevelLog) => void` | `console.log(``${level} - ${msg}``)` | false | false

```typescript
import { AU2Storybook } from './aurelia-stories';

const au2Storybook = new AU2Storybook({
  cwd: './path-of-your-supra-ultra-project',
  out: './path-of-your-supra-ultra-project/src/stories',
});

for (const ceStories of this._au2Storybook.getStories()) {
  console.dir(ceStories);
}
```

# Coverage
[![codecov](https://codecov.io/gh/creadigme/aurelia-stories/branch/master/graph/badge.svg?token=JNC69B3DD1)](https://codecov.io/gh/creadigme/aurelia-stories)

![Coverage sunburst](https://codecov.io/gh/creadigme/aurelia-stories/branch/master/graphs/sunburst.svg?token=JNC69B3DD1)

![Coverage tree](https://codecov.io/gh/creadigme/aurelia-stories/branch/master/graphs/tree.svg?token=JNC69B3DD1)
