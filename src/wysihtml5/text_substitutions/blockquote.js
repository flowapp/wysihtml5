import { Composer } from "../views/composer";
import { renameElement } from "../dom/rename_element";
import { Constants } from "../constants";

Composer.RegisterTextSubstitution(function(textContent) {
  return (textContent == ">");
}, function(editor, composer, range, textContent, e) {
  var selectedNode = range.startContainer;

  var blockquote = composer.parentElement(selectedNode, {
    nodeName: "BLOCKQUOTE"
  });

  if (!blockquote) {
    var blockElement = composer.parentElement(selectedNode, {
      nodeName: Constants.BLOCK_ELEMENTS
    });

    // Consider using commands?
    if (blockElement) {
      if (composer.selection.caretIsAtStartOfNode(blockElement, range, selectedNode)) {
        range.deleteContents();
        var blockquote = document.createElement("blockquote");
        blockElement.parentNode.insertBefore(blockquote, blockElement);
        if (!blockElement.children.length) {
          blockElement.appendChild(document.createElement("br"));
        }
        blockquote.appendChild(blockElement);
        composer.selection.set(blockElement);
        if (e.type === "keydown" && e.keyCode == Constants.SPACE_KEY) {
          e.preventDefault();
        }
      }
    }
  }
}, {
  word: true,
  sentence: false
});
