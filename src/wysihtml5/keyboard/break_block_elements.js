import { Constants } from "../constants";
import { Composer } from "../views/composer";
import { convertNestedBlockquoteIntoParagraph } from "../helpers/convert_nested_blockquote_into_paragraph";
import { renameElement } from "../dom/rename_element";

Composer.RegisterKeyboardHandler(function(e) {
  return (
    e.type === "keydown" &&
    e.keyCode == Constants.ENTER_KEY &&
    !e.shiftKey
  );
}, function(editor, composer, e) {
  var selectedNode = composer.selection.getSelectedNode();
  var blockquote = composer.parentElement(selectedNode, {
    nodeName: ["BLOCKQUOTE"]
  });

  var paragraph = composer.parentElement(selectedNode, {
    nodeName: ["P"]
  });

  if (blockquote) {
    if (paragraph && !paragraph.textContent) {
      e.preventDefault();
      convertNestedBlockquoteIntoParagraph(paragraph, composer);
    } else if (!blockquote.textContent) {
      e.preventDefault();
      composer.selection.executeAndRestore(function() {
        renameElement(blockquote, "p");
      });
    }
  }
});
