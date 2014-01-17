import { Constants } from "../constants";
import { Composer } from "../views/composer";
import { browser } from "../browser";
import dom from "../dom";
import { insertParagraphAfter } from "../helpers/insert_paragraph_after";

Composer.RegisterKeyboardHandler(function(e) {
  return (
    e.type === "keydown" &&
    e.keyCode == Constants.ENTER_KEY &&
    !e.ctrlKey
  );
}, function(editor, composer, e) {
  var preElement = composer.parentElement(composer.selection.getSelectedNode(), {
    nodeName: ["PRE"]
  });

  if (preElement) {
    preElement.normalize();
    var selectedNode = composer.selection.getSelectedNode();
    var range = composer.selection.getRange().nativeRange;
    e.preventDefault();

    var newLineRange = document.createRange();
    newLineRange.selectNodeContents(selectedNode);

    var atEndOfNode = composer.selection.caretIsAtEndOfNode(newLineRange, preElement);
    if (range.collapsed && atEndOfNode) {
      if (range.startContainer.nodeType === Node.TEXT_NODE) {
        var content = range.startContainer.textContent.substr(Math.max(range.startOffset - 2, 0), 2);
        if (content == "\n\n") {
          insertParagraphAfter(preElement, composer);
          var text = range.startContainer.textContent;
          range.startContainer.textContent = text.slice(0, text.length - 2);
          return;
        }
      }
    }

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
