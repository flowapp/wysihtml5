import { Composer } from "../views/composer";
import { getParentElement } from "../dom/get_parent_element";
import { renameElement } from "../dom/rename_element";
import { Constants } from "../constants";

Composer.RegisterTextSubstitution(function(textContent) {
  return (textContent == ">");
}, function(editor, composer, range, textContent, e) {
  var selectedNode = range.startContainer;
  var blockElement = getParentElement(selectedNode, {
    nodeName: ["P", "DIV", "BLOCKQUOTE"]
  });
  if (blockElement && blockElement.nodeName != "BLOCKQUOTE") {
    if (composer.selection.caretIsAtStartOfNode(blockElement, range, selectedNode)) {
      var breakElement;
      if (blockElement.textContent.trim() == ">") {
        breakElement = document.createElement("br");
        blockElement.appendChild(breakElement);
      }

      composer.selection.executeAndRestore(function() {
        range.deleteContents();
        dom.renameElement(blockElement, "blockquote");
        if (breakElement) {
          composer.selection.setBefore(breakElement);
        }
      });
      if (e.type === "keydown" && e.keyCode == Constants.SPACE_KEY) {
        e.preventDefault();
      }
    }
  }
}, {
  word: true,
  sentence: false
});
