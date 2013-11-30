import { Composer } from "../views/composer";
import { Constants } from "../constants";
import dom from "../dom";

var LIST_ITEMS = ["LI"];
var LIST_TAGS = ["UL", "OL"];

Composer.RegisterKeyboardHandler(function(e) {
  return (
    e.type == "keydown" && 
    e.keyCode == Constants.BACKSPACE_KEY
  );
}, function(editor, composer, e) {
  var range = composer.selection.getRange()
  if (range.collapsed && range.startOffset == 0) {
    var selectedNode = composer.selection.getSelectedNode();
    var listItem = dom.getParentElement(selectedNode, {
      nodeName: ["LI"]
    });
    if (listItem) {
      var list = dom.getParentElement(listItem, {
        nodeName: LIST_TAGS
      });

      var type = list.tagName == "OL" ? "insertOrderedList" : "insertUnorderedList"
      if (listItem) {
        event.preventDefault();
        composer.selection.executeAndRestore(function() {
          document.execCommand(type, true, range.nativeRange)
        });
      }
    }
  }
});