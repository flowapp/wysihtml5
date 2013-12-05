import { Composer } from "../views/composer";
import { Constants } from "../constants";
import dom from "../dom";

Composer.RegisterKeyboardHandler(function(e) {
  return (
    e.type == "keydown"
  );
}, function(editor, composer, e) {
  var range = composer.selection.getRange()
  var selectedNode = composer.selection.getSelectedNode();
  var parentElement = selectedNode.parentElement;

  if(parentElement && parentElement.getAttribute("contenteditable") == "false") {
    parentElement.parentElement.removeChild(parentElement);
    if(e.keyCode == Constants.BACKSPACE_KEY) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
});
