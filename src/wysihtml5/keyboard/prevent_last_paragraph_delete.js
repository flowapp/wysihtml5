import { Constants } from "../constants";
import { Composer } from "../views/composer";

Composer.RegisterKeyboardHandler(function(e) {
  return (
    e.type === "keydown" &&
    e.keyCode == Constants.BACKSPACE_KEY
  );
}, function(editor, composer, e) {
  var range = composer.selection.getRange();
  if (range && range.collapsed) {
    var selectedNode = composer.selection.getSelectedNode();
    if (
      selectedNode &&
      selectedNode === composer.element.firstElementChild &&
      selectedNode === composer.element.lastElementChild &&
      composer.selection.caretIsAtStartOfNode(selectedNode)
    ) {
      e.preventDefault();
    }
  }
})
