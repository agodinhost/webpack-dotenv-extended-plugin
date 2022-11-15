const dotenv = require('dotenv-extended');
const dotenvExpand = require('dotenv-expand')
const fs = require('fs');
const EnvironmentPlugin = require('webpack').EnvironmentPlugin;

function DotenvPlugin(options) {
  this.options = options || {};

  // Load into process.env, and keep track of all the
  // keys we care about for webpack serialization. 
  this.config = dotenv.load(options) || {};

  if ( options.expand ) {
    const env = dotenv.config();
    dotenvExpand.expand({
      ignoreProcessEnv: false,
      parsed: this.config
    });
  }
}

DotenvPlugin.prototype.apply = function(compiler) {
  if (this.options.verbose) {
    const definitions = {};

    Object.keys(this.config).forEach((key) => {
      if (this.config.hasOwnProperty(key)) {
        definitions[key] = process.env[key];
      }
    });

    console.log('Applying dotenv configuration', JSON.stringify(definitions, null, 2));
  }

  //compiler.apply(new EnvironmentPlugin(Object.keys(this.config)));

  new EnvironmentPlugin(Object.keys(this.config))
    .apply(compiler);  
};

module.exports = DotenvPlugin;
