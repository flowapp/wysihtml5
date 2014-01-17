import { Composer } from "../views/composer";
import { renameElement } from "../dom/rename_element";
import { Constants } from "../constants";

Composer.RegisterTextSubstitution(function(textContent) {
  return (textContent == ">");
}, function(editor, composer, range, textContent, e) {
  var selectedNode = range.startContainer;
  var blockElement = composer.parentElement(selectedNode, {
    nodeName: ["P", "DIV", "BLOCKQUOTE"]
  });
  if (blockElement && blockElement.nodeName != "BLOCKQUOTE") {
    if (composer.selection.caretIsAtStartOfNode(blockElement, range, selectedNode)) {
      var breakElement;
      if (blockElement.textContent.trim() == ">") {
        var paragraph = document.createElement("p");
        breakElement = document.createElement("br")
        paragraph.appendChild(breakElement);
        blockElement.appendChild(paragraph);
      }

      composer.selection.executeAndRestore(function() {
        range.deleteContents();
        renameElement(blockElement, "blockquote");
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
