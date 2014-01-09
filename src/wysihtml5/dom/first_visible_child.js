import { nodeList } from "./node_list";
import { Constants } from "../constants";

var firstVisibleChild = function(node) {
  var children = nodeList.toArray(node.childNodes);
  for (var index = 0; index < children.length; index++) {
    var child = children[index];
    switch (child.nodeType) {
      case Node.ELEMENT_NODE:
        return child;
      case Node.TEXT_NODE:
        var textContent = child.textContent.trim();
        if (textContent && textContent !== Constants.INVISIBLE_SPACE) {
          return child;
        }
        break;
    }
  }
  return null;
};

export { firstVisibleChild };
