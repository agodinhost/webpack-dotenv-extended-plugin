# Webpack dotenv-extended plugin

Use dotenv-extended with webpack.

## Motivation

[`dotenv`](https://github.com/bkeepers/dotenv) is a fantastic and useful way to
manage environment variables. I wanted to keep the good times going when
working with webpack for frontend projects.

## Install

```
npm i --save-dev webpack-dotenv-extended-plugin
```

## Usage

`webpack-dotenv-extended-plugin` uses [`dotenv-extended`](https://github.com/keithmorris/node-dotenv-extended)
under the hood to read and check environment variables. The same options that
can be passed to `dotenv-extended` can be passed to this plugin.

It then reads, parses and exports the listed env vars from `.env` into
stringified `process.env` so it can be bundled for use with webpack.

Externally set environment variables will override vars set in `.env`.

```js
// webpack.config.js
const DotenvPlugin = require('webpack-dotenv-extended-plugin');

module.exports = {
  ...
  plugins: [
    new DotenvPlugin({
      schema: './.env.schema',
      defaults: './.env.default',
      path: './.env'
    })
  ]
  ...
};
```
