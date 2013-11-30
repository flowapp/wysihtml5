import dom from "../dom";
import { Constants } from "../constants";

var insertOrderedList = {
  exec: function(composer, command) {
    var doc           = composer.doc,
        selectedNode  = composer.selection.getSelectedNode(),
        list          = dom.getParentElement(selectedNode, { nodeName: "OL" }),
        otherList     = dom.getParentElement(selectedNode, { nodeName: "UL" }),
        tempClassName =  "_wysihtml5-temp-" + new Date().getTime(),
        isEmpty,
        tempElement;
    
    if (!list && !otherList && true) { //composer.commands.support(command)) {
      doc.execCommand(command, false, null);
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
    } else {
      // Create list
      tempElement = composer.selection.deblockAndSurround({
        "nodeName": "div",
        "className": tempClassName
      });
      if (tempElement) {
        isEmpty = tempElement.innerHTML === "" || tempElement.innerHTML === Constants.INVISIBLE_SPACE || tempElement.innerHTML === "<br>";
        composer.selection.executeAndRestore(function() {
          list = dom.convertToList(tempElement, "ol", composer.parent.config.uneditableContainerClassname);
        });
        if (isEmpty) {
          composer.selection.selectNode(list.querySelector("li"), true);
        }
      }
    }
  },
  
  state: function(composer) {
    var selectedNode = composer.selection.getSelectedNode();
    return dom.getParentElement(selectedNode, { nodeName: "OL" });
  }
};

export { insertOrderedList };