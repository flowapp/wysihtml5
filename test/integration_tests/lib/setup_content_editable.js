var wd = require("wd");

function SetupContentEditable(content, url) {
  url = url || "http://localhost:8000/test/integration_tests/html/index.html";
  var item;
  return browser.get(url).then(function() {
    return browser.elementById("editor");
  }).then(function(editor) {
    item = editor;
    return browser.execute("window.editor = (new wysihtml5.Editor(arguments[0]));", [item]);
  }).then(function() {
    return browser.execute("arguments[0].innerHTML = arguments[1];", [item, content]);
  }).then(function() {
    return item.type("a"+ wd.SPECIAL_KEYS["Back space"]);
  }).then(function() {
    return item;
  });
}

module.exports = SetupContentEditable;
