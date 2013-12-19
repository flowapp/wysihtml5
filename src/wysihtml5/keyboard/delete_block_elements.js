import { Constants } from "../constants";
import { Composer } from "../views/composer";
import dom from "../dom";
import { convertListItemIntoParagraph } from "../helpers/convert_list_item_into_paragraph";

Composer.RegisterKeyboardHandler(function(e) {
  return (
    e.type === "keydown" &&
    e.keyCode == Constants.BACKSPACE_KEY
  );
}, function(editor, composer, e) {
  var range = composer.selection.getRange();
  var selectedNode = composer.selection.getSelectedNode();
  var blockElement = dom.getParentElement(selectedNode, {
    nodeName: ["BLOCKQUOTE", "PRE", "LI"]
  });
  if (range.collapsed && blockElement && composer.selection.caretIsAtStartOfNode(blockElement)) {
    e.preventDefault();
    if (blockElement.nodeName == "LI") {
      convertListItemIntoParagraph(blockElement, composer);
    } else {
      composer.selection.executeAndRestore(function() {
        dom.renameElement(blockElement, "p");
      });
    }
  }
});
