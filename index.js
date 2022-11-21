const dotenv = require('dotenv-extended');
//const fs = require('fs');
const EnvironmentPlugin = require('webpack').EnvironmentPlugin;

var debugOn = true;
var debug = function () {
  if (debugOn)
    console.debug.apply(this, arguments);
}

/**
 * Default constructor for common case uses.
 * Normally you will have only one env file and will use the default options.
 * 
 * Load into process.env, and keep track of all the
 * keys we care about for webpack serialization. 
 * 
 * @param {*} options 
 */
var DotenvPlugin = function (options) {
  debug('# DotenvPlugin.constructor\n\t%s', JSON.stringify(options));
  this.optionsDef = merge(options);
  this.config = dotenv.load(this.optionsDef) || {};
}

DotenvPlugin.prototype.apply = function (compiler) {
  debug('# DotenvPlugin.apply(compiler)');
  if (this.options.verbose) {
    const definitions = {};
    Object.keys(this.config).forEach((key) => {
      if (this.config.hasOwnProperty(key)) {
        definitions[key] = process.env[key];
      }
    });
    console.log('Applying dotenv configuration', JSON.stringify(definitions, null, 2));
  }

  new EnvironmentPlugin(Object.keys(this.config))
    .apply(compiler);
}

module.exports = DotenvPlugin;

/* --------------------------------------------------------------------------- */

var xDotEnv = function (...options) {
  this.config = {};
  if (options)
  this.load(...options);
}

xDotEnv.prototype.load = function (...options) {
  //TODO: paths > 1 && options > 1 then error
  debug('# xDotEnv.load\n\t%s', JSON.stringify(options));
  this.paths = getPathsAsArray(options);
  debug('# xDotEnv.paths\n\t%s', JSON.stringify(this.paths));
  this.optionsDef = getOptionsDef(options);
  debug('# xDotEnv.optionsDef\n\t%s', JSON.stringify(this.optionsDef));
  
  /* load all */
  //TODO: ignoreError exceto no último .env?
  this.paths.forEach(item => {
    Object.assign(this.optionsDef, { path: item });
    debug('# xDotEnv.optionsDef2\n\t%s', JSON.stringify(this.optionsDef));
    var tmp = dotenv.load(this.optionsDef) || {};
    Object.assign(this.config, tmp);
  });

  if (this.optionsDef.expand) {
    const dotenvExpand = require('dotenv-expand');
    dotenvExpand.expand({
      ignoreProcessEnv: false,
      parsed: this.config
    });
  }
}

xDotEnv.prototype.apply = function (compiler) {
  debug('# xDotEnv.apply(compiler)');

  dotenv.validate();

  if (this.optionsDef.verbose) {
    var definitions = {};
    Object.keys(this.config).forEach((key) => {
      if (this.config.hasOwnProperty(key)) {
        definitions[key] = process.env[key];
      }
    });
    console.log('Applying dotenv configuration', JSON.stringify(definitions, null, 2));
  }

  new EnvironmentPlugin(Object.keys(this.config))
    .apply(compiler);
}

module.exports = xDotEnv;

/* --------------------------------------------------------------------------- */

var merge = function (options, path) {
  this.options = options || {};
  this.optionsDef = {
    // defaults: null,
    expand: true,
    verbose: true,
    silent: false,                /* default true  */
    errorOnMissing: true,         /* default false */
    errorOnExtra: true,           /* default false */
    errorOnRegex: false,           /* default false */
    includeProcessEnv: true,     /* default false */
    assignToProcessEnv: true,     /* default true  */
    overrideProcessEnv: true     /* default false */
  };
  Object.assign(this.optionsDef, this.options);
  if (path) {
    Object.assign(this.optionsDef, { path: path });
  }
  return this.optionsDef;
}

var typeOf2 = function (value) {
  return {}.toString.call(value).split(' ')[1].slice(0, -1).toLowerCase();
}

var getPathsAsArray = function (options) {
  var paths = [];
  options.forEach(item => {
    var type = typeOf2(item);
    if (type === 'string')
      paths.push(item);
  });
  return paths;
}

//TODO: check if options is an array of configs?
var getPathsAsArray2 = function(options) {
  //exercício ...
  var arr = options;
  const type = typeOf2(options);
  debug('# getPathsAsArray %s', type);
  if (type === 'object') {
    arr = Object.entries(options);
  }
  const paths = arr.filter(([key, value]) => typeOf2(value) === 'string'); 
  return paths;
}

var getFirstObject = function (options) {
  var first = null;
  options.forEach(item => {
    var type = typeOf2(item);
    if (type === 'object') {
      first = item;
      return;
    }
  });
  return first;
}

var getOptionsDef = function (options) {
  var options2 = getFirstObject(options);
  return merge(options2);
}
