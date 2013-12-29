import { Constants } from "../constants";
import { Composer } from "../views/composer";
import { isNonPrintableKey } from "../helpers/is_non_printable_key";

import dom from "../dom";

Composer.RegisterKeyboardHandler(function(e) {
  return (
    e.type === "keydown"
  );
}, function(editor, composer, e) {
  var range = composer.selection.getRange();
  if (range.collapsed && e.keyCode == Constants.BACKSPACE_KEY) {
    var selectedNode = composer.selection.getSelectedNode();
    var blockElement = dom.getParentElement(selectedNode, {
      nodeName: ["BLOCKQUOTE", "PRE", "P"]
    });

    if (blockElement && composer.selection.caretIsAtStartOfNode(blockElement)) {
      var nextElementSibling = blockElement.nextElementSibling;
      var previousElementSibling = blockElement.previousElementSibling;
      if (nextElementSibling && previousElementSibling) {
        if (
          (nextElementSibling.nodeName == "UL" && previousElementSibling.nodeName == "UL") ||
          (nextElementSibling.nodeName == "OL" && previousElementSibling.nodeName == "OL")
        ) {
          setTimeout(function() {
            composer.selection.executeAndRestore(function() {
              dom.appendChildNodes(nextElementSibling, previousElementSibling);
              nextElementSibling.parentNode.removeChild(nextElementSibling);
            });
          }, 0);
        }
      }
    }
  } else if (
    !isNonPrintableKey(e.keyCode) ||
    e.keyCode == Constants.BACKSPACE_KEY ||
    e.keyCode == Constants.DELETE_KEY
  ) {
    var endBlockElement = dom.getParentElement(range.endContainer, {
      nodeName: ["BLOCKQUOTE", "PRE", "P"]
    });

    var startBlockElement = dom.getParentElement(range.startContainer, {
      nodeName: ["UL", "OL"]
    });

    if (endBlockElement && startBlockElement) {
      var nextElementSibling = endBlockElement.nextElementSibling;
      if (nextElementSibling && nextElementSibling.nodeName == startBlockElement.nodeName) {
        setTimeout(function() {
          composer.selection.executeAndRestore(function() {
            dom.appendChildNodes(nextElementSibling, startBlockElement);
            nextElementSibling.parentNode.removeChild(nextElementSibling);
          });
        }, 0);
      }
    }
  }
});
