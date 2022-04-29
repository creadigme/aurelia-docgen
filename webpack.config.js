/* eslint-disable @typescript-eslint/no-var-requires */
const nodeExternals = require('webpack-node-externals');
const configurator = require('./.build/webpack.node.configurator');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = [
  configurator({
    org: 'creadigme',
    name: 'aurelia-stories',
    directory: __dirname,
    target: 'node',
    libraryType: 'commonjs',
    externals: [nodeExternals({})],
    plugins: [new CopyWebpackPlugin({ patterns: [{ from: 'static', to: 'static' }] })],
  }),
];
