import { Constants } from "../constants";
import { Composer } from "../views/composer";
import dom from "../dom";

Composer.RegisterKeyboardHandler(function(e) {
  return (
    e.type === "keydown" && 
    e.keyCode == Constants.ENTER_KEY
  );
}, function(editor, composer, e) {
  var blockElement = dom.getParentElement(composer.selection.getSelectedNode(), { 
    nodeName: ["H1", "H2", "H3", "H4", "H5", "H6"] 
  }, 4);

  if (blockElement) {
    setTimeout(function() {
      var selectedNode = composer.selection.getSelectedNode();
      composer.selection.executeAndRestore(function() {
        dom.renameElement(selectedNode, "p");
      })
    }, 0);
  }
});