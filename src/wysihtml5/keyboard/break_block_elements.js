import { Constants } from "../constants";
import { Composer } from "../views/composer";
import { convertNestedBlockquoteIntoParagraph } from "../helpers/convert_nested_blockquote_into_paragraph";
import dom from "../dom";

Composer.RegisterKeyboardHandler(function(e) {
  return (
    e.type === "keydown" &&
    e.keyCode == Constants.ENTER_KEY &&
    !e.shiftKey
  );
}, function(editor, composer, e) {
  var selectedNode = composer.selection.getSelectedNode();
  var blockquote = dom.getParentElement(selectedNode, {
    nodeName: ["BLOCKQUOTE"]
  }, 4);

  var paragraph = dom.getParentElement(selectedNode, {
    nodeName: ["P"]
  }, 4);

  if (blockquote) {
    if (paragraph && !paragraph.textContent) {
      e.preventDefault();
      convertNestedBlockquoteIntoParagraph(paragraph, composer);
    } else if (!blockquote.textContent) {
      e.preventDefault();
      composer.selection.executeAndRestore(function() {
        dom.renameElement(blockquote, "p");
      });
    }
  }
});
