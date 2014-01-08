import { all } from "../dom/all";
import { Constants } from "../constants";
import { replaceWithChildNodes } from "../dom/replace_with_child_nodes";

var toPlainText = function(node) {
  var children = all.elements(node);
  children.reverse().forEach(function(child) {
    if (child.nodeName == "BR") {
      child.parentNode.replaceChild(document.createTextNode("\n"), child);
    } else {
      if (Constants.BLOCK_ELEMENTS.indexOf(child.nodeName) != -1 && node.lastChild != child) {
        child.innerHTML += "\n\n";
      }
      replaceWithChildNodes(child);
    }
  });
};

export { toPlainText };
