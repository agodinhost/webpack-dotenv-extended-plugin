const dotenv = require('dotenv-extended');
const fs = require('fs');
const DefinePlugin = require('webpack').DefinePlugin;

module.exports = DotenvPlugin;

function DotenvPlugin(options) {
  this.options = options || {};

  // Load into process.env, and keep track of all the
  // keys we care about for webpack serialization. 
  this.config = dotenv.load(options) || {};
}

DotenvPlugin.prototype.apply = function(compiler) {
  const definitions = {};

  Object.keys(process.env).forEach((key) => {
    if (this.config.hasOwnProperty(key)) {
      definitions[key] = JSON.stringify(process.env[key]);
    }
  });

  if (this.options.verbose) {
    console.log('Applying dotenv configuration', JSON.stringify(definitions, null, 2));
  }

  compiler.apply(new DefinePlugin({
    'process.env': definitions
  }));
};
