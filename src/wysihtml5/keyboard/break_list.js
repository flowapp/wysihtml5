import { Constants } from "../constants";
import { Composer } from "../views/composer";
import dom from "../dom";

var LIST_TAGS = ["UL", "OL", "MENU"];

Composer.RegisterKeyboardHandler(function(e) {
  return (
    e.type === "keydown" &&
    e.keyCode == Constants.ENTER_KEY
  );
}, function(editor, composer, e) {
  var listItem = dom.getParentElement(composer.selection.getSelectedNode(), {
    nodeName: ["LI"]
  }, 4);

  if (listItem) {
    setTimeout(function() {
      var selectedNode = composer.selection.getSelectedNode();
      var list = dom.getParentElement(selectedNode, {
        nodeName: LIST_TAGS
      });

      if (!list) {
        composer.selection.executeAndRestore(function() {
          dom.renameElement(selectedNode, "p");
        });
      }
    }, 0);
  }
});
