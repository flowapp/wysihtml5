import { Constants } from "../constants";
import { Composer } from "../views/composer";
import { renameElement } from "../dom/rename_element";

Composer.RegisterKeyboardHandler(function(e) {
  return (
    e.type === "keydown" &&
    e.keyCode == Constants.ENTER_KEY
  );
}, function(editor, composer, e) {
  var blockElement = composer.parentElement(composer.selection.getSelectedNode(), {
    nodeName: Constants.HEADER_ELEMENTS
  });
  var range = composer.selection.getRange();
  if (blockElement && composer.selection.caretIsAtEndOfNode(range, blockElement)) {
    setTimeout(function() {
      var selectedNode = composer.selection.getSelectedNode();
      composer.selection.executeAndRestore(function() {
        renameElement(selectedNode, "p");
      });
    }, 10);
  }
});
