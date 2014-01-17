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

var insertUnorderedList = {
  exec: function(composer, command) {
    var selectedNode = composer.selection.getSelectedNode();
    var list = composer.parentElement(selectedNode, { nodeName: "UL" });
    var otherList = composer.parentElement(selectedNode, { nodeName: "OL" });

    if(list && !composer.element.contains(list)) {
      list = null
    }

    if(otherList && !composer.element.contains(otherList)) {
      otherList = null
    }

    if (!list && !otherList) {
      document.execCommand(command, false, null);
      cleanup(composer);
      return;
    }

    if (list) {
      // Unwrap list
      // <ul><li>foo</li><li>bar</li></ul>
      // becomes:
      // foo<br>bar<br>
      composer.selection.executeAndRestore(function() {
        dom.resolveList(list, composer.config.useLineBreaks);
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
    var node = composer.parentElement(selectedNode, { nodeName: "UL" });
    return (composer.element.contains(node) ? node : false);
  }
};

export { insertUnorderedList };
