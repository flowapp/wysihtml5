import { Composer } from "../views/composer";
import { Constants } from "../constants";

var autoList = function(editor, composer, range, textContent, e) {
  var selectedNode = range.startContainer;
  var blockElement = composer.parentElement(selectedNode, {
    nodeName: ["P", "DIV", "LI"]
  });
  if (blockElement && blockElement.nodeName != "LI") {
    if (composer.selection.caretIsAtStartOfNode(blockElement, range, selectedNode)) {
      composer.selection.executeAndRestore(function() {
        var orderedList = hasPrefix(textContent, "1.");

        var deleteRange = document.createRange();
        deleteRange.setStart(range.startContainer, 0);
        deleteRange.setEnd(range.startContainer, orderedList ? 2 : 1);
        deleteRange.deleteContents();

        var selection = composer.selection.getSelection().nativeSelection;
        selection.removeAllRanges();
        selection.addRange(range);

        var command = orderedList ? "insertOrderedList" : "insertUnorderedList";
        composer.commands.exec(command);
      });
      return true;
    }
  }
  return false;
};

var hasPrefix = function(string, prefix) {
  return string.indexOf(prefix) == 0
};

var isListPrefix = function(textContent, exact) {
  if (exact) {
    return (textContent == "1." || textContent == "•" || textContent == "*" || textContent == "-");
  } else {
    return (
      hasPrefix(textContent, "1.") ||
      hasPrefix(textContent, "•") ||
      hasPrefix(textContent, "*") ||
      hasPrefix(textContent, "-")
    );
  }
};

Composer.RegisterTextSubstitution(function(textContent) {
  return isListPrefix(textContent, true);
}, function(editor, composer, range, textContent, e) {
  if (autoList(editor, composer, range, textContent, e)) {
    if (e.type === "keydown" && e.keyCode == Constants.SPACE_KEY) {
      e.preventDefault();
    }
  }
}, {
  word: true,
  sentence: false
});

Composer.RegisterTextSubstitution(function(textContent) {
  return isListPrefix(textContent);
}, autoList, {
  word: false,
  sentence: true
});
