import { Constants } from "../constants";
import { Composer } from "../views/composer";
import { ensureParagraph } from "../helpers/ensure_paragraph";
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

  if (listItem && !listItem.textContent) {
    setTimeout(function() {
      composer.selection.executeAndRestore(function() {
        var selectedNode = composer.selection.getSelectedNode();
        ensureParagraph(selectedNode, composer);
      });
    }, 0);
  }
});
