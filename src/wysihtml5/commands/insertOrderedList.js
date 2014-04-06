import dom from "../dom";
import { Constants } from "../constants";
import { listCleanup } from "../helpers/list_cleanup";

var insertOrderedList = {
  exec: function(composer, command) {
    var selectedNode = composer.selection.getSelectedNode();
    var list = composer.parentElement(selectedNode, { nodeName: "OL" });
    var otherList = composer.parentElement(selectedNode, { nodeName: "UL" });

    if (!list && !otherList) {
      document.execCommand(command, false, null);
      listCleanup(composer);
      return;
    }

    if (list) {
      // Unwrap list
      // <ol><li>foo</li><li>bar</li></ol>
      // becomes:
      // foo<br>bar<br>
      composer.selection.executeAndRestore(function() {
        dom.resolveList(list);
      });
    } else if (otherList) {
      // Turn an unordered list into an ordered list
      // <ul><li>foo</li><li>bar</li></ul>
      // becomes:
      // <ol><li>foo</li><li>bar</li></ol>
      composer.selection.executeAndRestore(function() {
        dom.renameElement(otherList, "ol");
      });
    }
  },

  state: function(composer) {
    var selectedNode = composer.selection.getSelectedNode();
    return composer.parentElement(selectedNode, { nodeName: "OL" }) || false;
  }
};

export { insertOrderedList };
