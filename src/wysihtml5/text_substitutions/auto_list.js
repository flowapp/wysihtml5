import { Composer } from "../views/composer";

Composer.RegisterTextSubstitution(function(word) {
  return (word == "1.");
}, function(editor, composer, range, textContent, e) {
  composer.selection.executeAndRestore(function() {
    range.deleteContents();

    var selection = composer.selection.getSelection().nativeSelection;
    selection.removeAllRanges();
    selection.addRange(range);
    composer.commands.exec("insertOrderedList");
  });
}, {
  word: true,
  sentence: false
});
