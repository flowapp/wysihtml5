import { Composer } from "../views/composer";
import { renameElement } from "../dom/rename_element";
import { Constants } from "../constants";

Composer.RegisterTextSubstitution(function(textContent) {
  return (textContent.indexOf("```") == 0);
}, function(editor, composer, range, textContent, e) {
  var selectedNode = range.startContainer;
  var blockElement = composer.parentElement(selectedNode, {
    nodeName: ["P", "PRE"]
  });
  if (blockElement && blockElement.nodeName != "PRE") {
    if (composer.selection.caretIsAtStartOfNode(blockElement, range, selectedNode)) {
      var breakElement;
      if (blockElement.textContent.trim() == range.toString()) {
        breakElement = document.createElement("br");
        blockElement.appendChild(breakElement);
      }

      composer.selection.executeAndRestore(function() {
        range.deleteContents();
        renameElement(blockElement, "pre");
        if (breakElement) {
          composer.selection.setBefore(breakElement);
        }
      });
      if (e.type === "keydown" && e.keyCode == Constants.SPACE_KEY || e.keyCode == Constants.ENTER_KEY) {
        e.preventDefault();
      }
    }
  }
}, {
  word: true,
  sentence: true
});
