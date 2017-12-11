const dotenv = require('dotenv-extended');
const fs = require('fs');
const DefinePlugin = require('webpack').DefinePlugin;

module.exports = DotenvPlugin;

function DotenvPlugin(options) {
  this.definitions = dotenv.load(options);
}

DotenvPlugin.prototype.apply = function(compiler) {
  const definitions = {};

  Object.keys(this.definitions).forEach((key) => {
    definitions[key] = JSON.stringify(this.definitions[key]);
  });

  compiler.apply(new DefinePlugin({
      'process.env': definitions
  }));
};
