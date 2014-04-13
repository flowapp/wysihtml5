import { Constants } from "../constants";
import { Composer } from "../views/composer";
import dom from "../dom";
import convertListItemsIntoParagraphs from "../helpers/convert_list_item_into_paragraph";
import { convertNestedBlockquoteIntoParagraph } from "../helpers/convert_nested_blockquote_into_paragraph";

Composer.RegisterKeyboardHandler(function(e) {
  return (
    e.type === "keydown" &&
    e.keyCode === Constants.BACKSPACE_KEY
  );
}, function(editor, composer, e) {
  var range = composer.selection.getRange();
  var selectedNode = composer.selection.getSelectedNode();
  var blockElement = composer.parentElement(selectedNode, {
    nodeName: ["BLOCKQUOTE", "PRE", "LI", "P"]
  });
  if (range.collapsed && blockElement && composer.selection.caretIsAtStartOfNode(blockElement)) {
    if (blockElement.nodeName === "LI") {
      var paragraph = convertListItemsIntoParagraphs([blockElement])[0];
      composer.selection.setBefore(paragraph);
    } else if (blockElement.nodeName === "P") {
      var blockquote = composer.parentElement(blockElement, {
        nodeName: ["BLOCKQUOTE"]
      });
      if (blockquote) {
        convertNestedBlockquoteIntoParagraph(blockElement, composer);
      } else {
        return;
      }
    } else {
      composer.selection.executeAndRestore(function() {
        dom.renameElement(blockElement, "p");
      });
    }
    e.preventDefault();
  }
});
