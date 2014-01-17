import dom from "../dom";
import { Constants } from "../constants";

var cleanup = function(composer) {
  var selectedNode = composer.selection.getSelectedNode();
  var blockElement = composer.parentElement(selectedNode, { nodeName: "P" });
  var listElement = composer.parentElement(selectedNode, { nodeName: ["OL", "UL", "MENU"] });
  if (blockElement && listElement) {
    dom.reblock(blockElement, listElement);
    composer.selection.setAfter(listElement.querySelector("li"));
  }
};

var insertOrderedList = {
  exec: function(composer, command) {
    var doc           = composer.doc,
        selectedNode  = composer.selection.getSelectedNode(),
        tempClassName =  "_wysihtml5-temp-" + new Date().getTime(),
        list = composer.parentElement(selectedNode, { nodeName: "OL" }),
        otherList = composer.parentElement(selectedNode, { nodeName: "UL" }),
        isEmpty,
        tempElement,
        otherList;

    if (!list && !otherList) {
      doc.execCommand(command, false, null);
      cleanup(composer);
      return;
    }

    if (list) {
      // Unwrap list
      // <ol><li>foo</li><li>bar</li></ol>
      // becomes:
      // foo<br>bar<br>
      composer.selection.executeAndRestore(function() {
        dom.resolveList(list, composer.config.useLineBreaks);
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
