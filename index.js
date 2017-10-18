const dotenv = require('dotenv-extended');
const fs = require('fs');
const DefinePlugin = require('webpack').DefinePlugin;

module.exports = DotenvPlugin;

function DotenvPlugin(options) {
  options = options || {};
  if (!options.defaults) options.defaults = './.env.defaults';
  if (!options.schema) options.schema = './.env.schema';
  if (!options.path) options.path = './.env';

  dotenv.load(options);

  this.defaults = dotenv.parse(fs.readFileSync(options.defaults));
  this.schema = dotenv.parse(fs.readFileSync(options.schema));
  this.env = {};
  if (fs.existsSync(options.path)) {
    this.env = dotenv.parse(fs.readFileSync(options.path));
  }
}

DotenvPlugin.prototype.apply = function(compiler) {
  const definitions = Object.keys(this.schema).reduce((definitions, key) => {
    const existing = process.env[key];

    if (existing) {
      definitions[key] = JSON.stringify(existing);
      return definitions;
    }

    const value = this.env[key];
    if (value) definitions[key] = JSON.stringify(value);

    return definitions;
  }, {});

  const definitionsWithDefaults = Object.keys(this.defaults).reduce((definitions, key) => {
    const definedValue = definitions[key];

    if (!definedValue) {
      definitions[key] = JSON.stringify(this.defaults[key]);
    }

    return definitions;
  }, definitions);

  compiler.apply(new DefinePlugin({
      'process.env': definitionsWithDefaults,
  }));
};
