import { Composer } from "../views/composer";
import { getParentElement } from "../dom/get_parent_element";

Composer.RegisterTextSubstitution(function(textContent) {
  return (textContent == "1." || textContent == "•" || textContent == "*");
}, function(editor, composer, range, textContent, e) {
  composer.selection.executeAndRestore(function() {
    range.deleteContents();

    var selection = composer.selection.getSelection().nativeSelection;
    selection.removeAllRanges();
    selection.addRange(range);

    var command = (textContent == "1.") ? "insertOrderedList" : "insertUnorderedList";
    composer.commands.exec(command);
  });
}, {
  word: true,
  sentence: false
});
