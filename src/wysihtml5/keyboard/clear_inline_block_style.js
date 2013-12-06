import { Constants } from "../constants";
import { Composer } from "../views/composer";
import dom from "../dom";

Composer.RegisterKeyboardHandler(function(e) {
  return (
    e.type === "keydown" &&
    e.keyCode == Constants.BACKSPACE_KEY
  );
}, function(editor, composer, e) {
  var selectedNode = composer.selection.getSelectedNode();
  var blockElement = dom.getParentElement(selectedNode, {
    nodeName: ["H1", "H2", "H3", "H4", "H5", "H6", "P", "PRE", "BLOCKQUOTE", "DIV"]
  }, 4);
  if (blockElement && composer.selection.caretIsAtStartOfNode(blockElement)) {
    setTimeout(function() {
      var selected = composer.selection.getSelectedNode();
      var nextSibling = selected.nextSibling;
      if (nextSibling && nextSibling.nodeName === "SPAN") {
        nextSibling.removeAttribute("style");
      }
    }, 0);
  }
});
