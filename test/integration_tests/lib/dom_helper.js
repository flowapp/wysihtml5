var wd = require("wd");

var DOM = {
  focus: function(item) {
    // HACK will focus the item, consider switching to `esc`
    return item.type(wd.SPECIAL_KEYS["Meta"]);
  },
  blur: function(item) {
    return browser.execute("arguments[0].blur();", [item]);
  },

  selectNodeContents: function(item) {
    return browser.execute("\
      range = document.createRange();\
      range.selectNodeContents(arguments[0]);\
      window.getSelection().removeAllRanges();\
      window.getSelection().addRange(range);\
    ", [item]);
  },

  exec: function(command) {
    return browser.execute("window.editor.composer.commands.exec(arguments[0], arguments[1]);", [command]);
  },

  selectStartOfNode: function(node) {
    return browser.execute("\
      range = document.createRange();\
      range.setStart(arguments[0].firstChild, 0);\
      range.setEnd(arguments[0].firstChild, 0);\
      window.getSelection().removeAllRanges();\
      window.getSelection().addRange(range);\
    ", [node]);
  }
}

module.exports = DOM;
