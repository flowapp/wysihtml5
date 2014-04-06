import dom from "../dom";
import { Constants } from "../constants";
import { listCleanup } from "../helpers/list_cleanup";

var insertUnorderedList = {
  exec: function(composer, command) {
    var selectedNode = composer.selection.getSelectedNode();
    var list = composer.parentElement(selectedNode, { nodeName: "UL" });
    var otherList = composer.parentElement(selectedNode, { nodeName: "OL" });

    if (!list && !otherList) {
      document.execCommand(command, false, null);
      listCleanup(composer);
      return;
    }

    if (list) {
      // Unwrap list
      // <ul><li>foo</li><li>bar</li></ul>
      // becomes:
      // foo<br>bar<br>
      composer.selection.executeAndRestore(function() {
        dom.resolveList(list);
      });
    } else if (otherList) {
      // Turn an ordered list into an unordered list
      // <ol><li>foo</li><li>bar</li></ol>
      // becomes:
      // <ul><li>foo</li><li>bar</li></ul>
      composer.selection.executeAndRestore(function() {
        dom.renameElement(otherList, "ul");
      });
    }
  },

  state: function(composer) {
    var selectedNode = composer.selection.getSelectedNode();
    return composer.parentElement(selectedNode, { nodeName: "UL" }) || false;
  }
};

export { insertUnorderedList };
