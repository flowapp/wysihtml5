import dom from "../dom";
import { Constants } from "../constants";

var insertUnorderedList = {
  exec: function(composer, command) {
    var doc           = composer.doc,
        selectedNode  = composer.selection.getSelectedNode(),
        list          = dom.getParentElement(selectedNode, { nodeName: "UL" }),
        otherList     = dom.getParentElement(selectedNode, { nodeName: "OL" }),
        tempClassName =  "_wysihtml5-temp-" + new Date().getTime(),
        isEmpty,
        tempElement;
    
    if (!list && !otherList && composer.commands.support(command)) {
      doc.execCommand(command, false, null);
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
    } else {
      // Create list
      tempElement = composer.selection.deblockAndSurround({
        "nodeName": "div",
        "className": tempClassName
      });
      if (tempElement) {
        isEmpty = tempElement.innerHTML === "" || tempElement.innerHTML === Constants.INVISIBLE_SPACE || tempElement.innerHTML === "<br>";
        composer.selection.executeAndRestore(function() {
          list = dom.convertToList(tempElement, "ul", composer.parent.config.uneditableContainerClassname);
        });
        if (isEmpty) {
          composer.selection.selectNode(list.querySelector("li"), true);
        }
      }
    }
  },
  
  state: function(composer) {
    var selectedNode = composer.selection.getSelectedNode();
    return dom.getParentElement(selectedNode, { nodeName: "UL" });
  }
};

export { insertUnorderedList };