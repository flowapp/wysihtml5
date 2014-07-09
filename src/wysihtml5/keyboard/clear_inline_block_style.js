import { Constants } from "../constants";
import { Composer } from "../views/composer";
import { nodeList } from "../dom/node_list";
import { replaceWithChildNodes } from "../dom/replace_with_child_nodes";

Composer.RegisterKeyboardHandler(function(e) {
  return (
    e.type === "keydown" &&
    e.keyCode == Constants.BACKSPACE_KEY
  );
}, function(editor, composer, e) {
  var range = composer.selection.getRange();
  var selectedNode = composer.selection.getSelectedNode();
  var blockElement = composer.parentElement(selectedNode, {
    nodeName: Constants.BLOCK_ELEMENTS
  });
  if (range.collapsed) {
    if (blockElement && composer.selection.caretIsAtStartOfNode(blockElement)) {
      setTimeout(function() {
        var selected = composer.selection.getSelectedNode();
        var nextSibling = selected.nextSibling;
        if (nextSibling && nextSibling.nodeName === "SPAN") {
          nextSibling.removeAttribute("style");
          if (!nextSibling.attributes.length) {
            replaceWithChildNodes(nextSibling);
            //selected.parentNode.normalize();
          }
        }
      }, 0);
    }
  } else {
    setTimeout(function() {
      var selected = composer.selection.getSelectedNode();
      var nextSibling = selected.nextSibling;
      if (nextSibling && nextSibling.nodeName === "SPAN") {
        nextSibling.removeAttribute("style");
        if (!nextSibling.attributes.length) {
          replaceWithChildNodes(nextSibling);
          //selected.parentNode.normalize();
        }
      }
    }, 0);
  }
});
