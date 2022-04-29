// Path to your webpack.config
const customWP = require('../webpack.config.js');

module.exports = {
  // Use the configuration
  webpackFinal: async (config) => {
    const customConfigs = customWP(config.mode, {});
    return {
      ...config,
      module: {
        ...config.module,
        rules: (Array.isArray(customConfigs) ? customConfigs[0] : customConfigs).module.rules
      }
    };
  },
  "stories": [
    // "../src/**/*.stories.mdx",
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