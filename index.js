const dotenv = require('dotenv-extended');
const fs = require('fs');
const DefinePlugin = require('webpack').DefinePlugin;

module.exports = DotenvPlugin;

function DotenvPlugin(options) {
  // Load into process.env, and keep track of all the
  // keys we care about for webpack serialization. 
  this.config = dotenv.load(options);
}

DotenvPlugin.prototype.apply = function(compiler) {
  const definitions = {};

  Object.keys(this.definitions).forEach((key) => {
    if (this.config[key]) {
      definitions[key] = JSON.stringify(process.env[key]);
    }
  });

  compiler.apply(new DefinePlugin({
    'process.env': definitions
  }));
};
