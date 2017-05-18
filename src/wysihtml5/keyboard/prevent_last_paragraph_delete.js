import { Constants } from "../constants";
import { Composer } from "../views/composer";
import { isNonPrintableKey } from "../helpers/is_non_printable_key";

Composer.RegisterKeyboardHandler(function(e) {
  return (
    e.type === "keydown" &&
    !e.ctrlKey &&
    !e.metaKey &&
    !e.altKey &&
    !isNonPrintableKey(e.keyCode)
  );
}, function(editor, composer, e) {
    var range = composer.selection.getRange();
    var selection = composer.selection.getSelection();
    if (range) {
      var selectedNode = composer.selection.getSelectedNode();
      if (
        selectedNode &&
        ((selectedNode === composer.element.firstElementChild &&
        selectedNode === composer.element.lastElementChild) || selectedNode === composer.element) &&
        composer.selection.caretIsAtStartOfNode(selectedNode)
      ) {
        if (range.collapsed && e.keyCode === wysihtml5$constants$$Constants.BACKSPACE_KEY) {
          e.preventDefault();
        } else if (selection && e.keyCode !== wysihtml5$constants$$Constants.BACKSPACE_KEY && composer.element.textContent === selection.toString()) {
          composer.element.innerHTML = "";
          composer.ensureParagraph();
        }
      }
    }
})
