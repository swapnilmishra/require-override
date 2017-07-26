/**
 * Get the reference of require.extensions
 * This is the most important bit in this hack
 */
var extensions = require.extensions;
// just to keep the reference of original extension function
var origExt = {};
// As an example we are going to transpile our code via babel on runtime
var babel = require("babel-core");

function register() {
  console.log("calling register");
  /**
   * extensions object is where node handles what to do with the extension
   * so we are going to hack into it
   */

  // keep a reference of original extensions object for .js file
  origExt[".js"] = extensions[".js"];

  // actual ovveride
  extensions[".js"] = function(module, filename) {
    // keep a reference of compile object
    let oldCompile = module._compile;
    // override compile function which gets a module object
    module._compile = function(code, file) {
      // transpile code
      const newCode = babel.transform(code).code;
      module._compile = oldCompile;
      // now complile it using old compile fn so that everything works
      module._compile(newCode, file);
    };
    // return the result of call of old extension object with new module object
    return origExt[".js"](module, filename);
  };
}

module.exports = {
  register
};
