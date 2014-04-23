import { Constants } from "../constants";
import { Composer } from "../views/composer";

// Helpers
import { insertParagraphAfter } from "../helpers/insert_paragraph_after";
import { splitUpTextNodeAtCursor } from "../helpers/split_up_text_node_at_cursor";


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
    if (!range.collapsed) {
      range.deleteContents();
      range = composer.selection.getRange().nativeRange;
      selectedNode = composer.selection.getSelectedNode();
    }
    var atEndOfNode = composer.selection.caretIsAtEndOfNode(range, preElement);
    e.preventDefault();
    var newNode = splitUpTextNodeAtCursor(range)
    if (newNode) {
      var lineBreak = document.createElement("br");
      newNode.parentNode.insertBefore(lineBreak, newNode);
      composer.selection.setAfter(lineBreak);
    } else if (range.startContainer === preElement) {
      var lineBreak = document.createTextNode("\n");
      preElement.appendChild(lineBreak);
      composer.selection.setAfter(lineBreak);
    } else if (!range.startContainer.nextSibling) {
      var lineBreak1 = document.createElement("br");
      var lineBreak2 = document.createElement("br");
      var parent = range.startContainer.parentNode;
      parent.insertBefore(lineBreak2, range.startContainer.nextSibling);
      parent.insertBefore(lineBreak1, lineBreak2);

      composer.selection.setAfter(lineBreak1);

    } else {
      var lineBreak = document.createElement("br");
      range.startContainer.parentNode.insertBefore(lineBreak, range.startContainer.nextSibling);
      composer.selection.setAfter(lineBreak);
    }
  }








  return
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
          var breakElement = insertParagraphAfter(preElement, composer);
          composer.selection.setBefore(breakElement);

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
