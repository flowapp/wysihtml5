import { query } from "./query";
var normalize = function(node) {
  var childNode, unEditableNodes;
  node.normalize();
  unEditableNodes = query(node, "[contenteditable='false']");

  for(var i = 0; i < unEditableNodes.length; i++) {
    childNode = unEditableNodes[i];
    if(childNode.nextSibling) {
      childNode.parentNode.insertBefore(document.createTextNode(""), childNode.nextSibling);
    } else {
      childNode.parentNode.appendChild(document.createTextNode(""));
    }
  }
}

export {normalize};
