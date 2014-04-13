import { Constants } from "../constants";
import { Composer } from "../views/composer";

Composer.RegisterKeyboardHandler(function(e) {
  return (
    e.type === "keydown" &&
    e.keyCode == Constants.BACKSPACE_KEY
  );
}, function(editor, composer, e) {
  var selectedNode = composer.selection.getSelectedNode();
  var blockElement = composer.parentElement(selectedNode, {
    nodeName: Constants.BLOCK_ELEMENTS
  });
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
