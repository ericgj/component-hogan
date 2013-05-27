var fs     = require('fs')
  , hogan  = require('hogan.js')
  , path   = require('path')
  , debug  = require('debug')('component:builder:hogan');

/**
 * Replace Mustache files with compiled Javascript files (using Hogan)
 */

var extnames = [".stache",".mustache"]

module.exports = function (builder) {
  // Add the runtime.js to our top-level package's `scripts` array.
  debug('adding hogan runtime to %s', builder.config.name);

  // Add our runtime to the builder, and add a require call for our runtime,
  // so it's global for all future template functions.
  var runtime = fs.readFileSync(__dirname + '/runtime.js', 'utf8');
  builder.addFile('scripts', 'hogan-runtime.js', runtime);
  builder.append('var Hogan = require("' + builder.config.name + '/hogan-runtime");\n');

  // Before processing any scripts, convert `.stache` files to Javascript.
  builder.hook('before scripts', compile);
};


/**
 * Compile hogan.
 */

function compile (pkg, callback) {
  // Grab our Hogan templates.
  if (!pkg.config.templates) return callback();
  var files = pkg.config.templates.filter(function(f){ return ~extnames.indexOf(path.extname(f)) } );

  files.forEach(function (file) {
    debug('compiling: %s', pkg.path(file));

    var fullPath = pkg.path(file);

    // Read and compile.
    var string = fs.readFileSync(fullPath, 'utf8')
      , fn     = hogan.compile(string, { asString: 1 });

    // Add our new compiled version to the package, with the same name.
    file = file.slice(0, file.length - path.extname(file).length) + '.js';
    pkg.addFile('scripts', file, 'var t = new Hogan.Template(' + fn + '); module.exports = t.render.bind(t);' );
  });

  callback();
}

