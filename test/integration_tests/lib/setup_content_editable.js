var wd = require("wd");

function SetupContentEditable(content, url) {
  content = content || "";
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
    if (content.indexOf("[") === -1 && content.indexOf("|") === -1) {
      return item.type("a"+ wd.SPECIAL_KEYS["Back space"]);
    } else {
      return browser.execute(SetSelection.toString() +"; SetSelection(arguments[0]);", [item]);
    }
  }).then(function() {
    return item;
  });
}

function SetSelection(parent) {
  var range = document.createRange();
  var nodes = wysihtml5.dom.all.textNodes(parent);
  nodes.forEach(function(node) {
    var text = node.nodeValue;
    var index;
    var tempRange = {};
    index = text.indexOf("[");
    if (index !== -1) {
      node.nodeValue = text = text.replace("[", "");
      range.setStart(node, index);
      tempRange.startContainer = node;
      tempRange.startOffset = index;
    }
    index = text.indexOf("]");
    if (index !== -1) {
      node.nodeValue = text = text.replace("]", "");
      if (tempRange.startContainer === node) {
        range.setStart(node, tempRange.startOffset)
      }
      range.setEnd(node, index);
    }

    index = text.indexOf("|");
    if (index !== -1) {
      node.nodeValue = text = text.replace("|", "");
      range.setStart(node, index);
      range.setEnd(node, index);
    }
  });
  if (range.startContainer && range.endContainer) {
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

module.exports = SetupContentEditable;
