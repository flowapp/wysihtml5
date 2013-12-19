import { Constants } from "../constants";
import { Composer } from "../views/composer";
import dom from "../dom";

Composer.RegisterKeyboardHandler(function(e) {
  return (
    e.type === "keydown" &&
    e.keyCode == Constants.BACKSPACE_KEY
  );
}, function(editor, composer, e) {
  var range = composer.selection.getRange();
  if (range.collapsed) {
    var selectedNode = composer.selection.getSelectedNode();
    var blockElement = dom.getParentElement(selectedNode, {
      nodeName: ["BLOCKQUOTE", "PRE", "P"]
    });

    if (range.collapsed && blockElement && composer.selection.caretIsAtStartOfNode(blockElement)) {
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
            });
          }, 0);
        }
      }
    }
  } else {
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
          });
        }, 0);
      }
    }
  }
});
