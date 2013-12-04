import { Constants } from "../constants";
import { Composer } from "../views/composer";
import dom from "../dom";

Composer.RegisterKeyboardHandler(function(e) {
  return (
    e.type === "keydown" &&
    e.keyCode == Constants.ENTER_KEY &&
    !e.shiftKey
  );
}, function(editor, composer, e) {
  var selectedNode = composer.selection.getSelectedNode();
  var blockElement = dom.getParentElement(selectedNode, {
    nodeName: ["BLOCKQUOTE"]
  }, 4);
  if (blockElement && !blockElement.textContent) {
    event.preventDefault();
    composer.selection.executeAndRestore(function() {
      dom.renameElement(blockElement, "p");
    });
  }
});
