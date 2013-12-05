import { Composer } from "../views/composer";
import { getParentElement } from "../dom/get_parent_element";
import { Constants } from "../constants";

Composer.RegisterTextSubstitution(function(textContent) {
  return (textContent == "1." || textContent == "•" || textContent == "*" || textContent == "-");
}, function(editor, composer, range, textContent, e) {
  var selectedNode = range.startContainer;
  var blockElement = getParentElement(selectedNode, {
    nodeName: ["P", "DIV", "LI"]
  });
  if (blockElement && blockElement.nodeName != "LI") {
    if (composer.selection.caretIsAtStartOfNode(blockElement, range, selectedNode)) {
      composer.selection.executeAndRestore(function() {
        range.deleteContents();

        var selection = composer.selection.getSelection().nativeSelection;
        selection.removeAllRanges();
        selection.addRange(range);

        var command = (textContent == "1.") ? "insertOrderedList" : "insertUnorderedList";
        composer.commands.exec(command);
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
