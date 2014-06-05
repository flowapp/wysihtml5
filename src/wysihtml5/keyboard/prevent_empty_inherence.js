import { Constants } from "../constants";
import { Composer } from "../views/composer";
import dom from "../dom";
import { redraw } from "../quirks/redraw";

/*
  Prevent style inherence on `backspace` when the previousSibling is empty
*/

Composer.RegisterKeyboardHandler(function(e) {
  return (
    e.type === "keydown" &&
    e.keyCode === Constants.BACKSPACE_KEY
  );
}, function(editor, composer, e) {
  var range = composer.selection.getRange();
  if (range.collapsed) {
    var selectedNode = composer.selection.getSelectedNode();
    var blockElement = composer.parentElement(selectedNode, {
      nodeName: ["LI", "P", "H1", "H2", "H3", "H4", "H5", "H6", "PRE", "BLOCKQUOTE", "DIV"]
    });

    if (composer.selection.caretIsAtStartOfNode(blockElement)) {
      var previousSibling = blockElement && blockElement.previousElementSibling;
      if (previousSibling) {
        if(!previousSibling.textContent && !previousSibling.querySelector("img")) {
          previousSibling.parentNode.removeChild(previousSibling);
          e.preventDefault();
        }
      }
    }
  }
});
