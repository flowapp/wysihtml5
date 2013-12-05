import { Constants } from "../constants";
import { Composer } from "../views/composer";
import { browser } from "../browser";
import dom from "../dom";

Composer.RegisterKeyboardHandler(function(e) {
  return (
    e.type === "keydown" &&
    e.keyCode == Constants.ENTER_KEY
  );
}, function(editor, composer, e) {
  var selectedNode = composer.selection.getSelectedNode();
  var preElement = dom.getParentElement(selectedNode, {
    nodeName: ["PRE"]
  });

  var range = composer.selection.getRange().nativeRange;

  if (preElement) {
    e.preventDefault();
    if (!range.collapsed) {
      range.deleteContents();
    }
    var newLines = 1;
    if (composer.selection.caretIsAtEndOfNode(range, preElement)) {
      newLines++;
    }
    var html = new Array(newLines + 1);
    composer.commands.exec("insertHTML", html.join(String.fromCharCode(10)));
  }
});
