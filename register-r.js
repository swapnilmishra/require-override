var extensions = require.extensions;
var origExt = {};
var babel = require("babel-core");

function register() {
  console.log("calling register");
  origExt[".js"] = extensions[".js"];
  extensions[".js"] = function(module, filename) {
    let oldCompile = module._compile;
    module._compile = function(code, file) {
      const newCode = babel.transform(code).code;
      module._compile = oldCompile;
      module._compile(newCode, file);
    };
    return origExt[".js"](module, filename);
  };
}

module.exports = {
  register
};
