import dom from "../dom";
import { Constants } from "../constants";

var cleanup = function(composer) {
  var selectedNode = composer.selection.getSelectedNode();
  var blockElement = dom.getParentElement(selectedNode, { nodeName: "P" });
  var listElement = dom.getParentElement(selectedNode, { nodeName: ["OL", "UL", "MENU"] });
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
        isEmpty,
        tempElement,
        list,
        otherList;

    if(composer.element.querySelector("OL")) {
      list = dom.getParentElement(selectedNode, { nodeName: "OL" });
    }

    if(composer.element.querySelector("UL")) {
     otherList = dom.getParentElement(selectedNode, { nodeName: "UL" });
    }

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
    if(composer.element.querySelector("OL")) {
      return dom.getParentElement(selectedNode, { nodeName: "OL" });
    } else {
      return false;
    }
  }
};

export { insertOrderedList };
