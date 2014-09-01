import { nodeList } from "../dom/node_list";

var splitNode = function(pivot) {
  if (pivot.nextSibling) {
    var parent = pivot.parentNode;
    var fork = document.createElement(parent.nodeName);
    var childNodes = nodeList.toArray(parent.childNodes);
    childNodes = childNodes.slice(childNodes.indexOf(pivot) + 1);
    childNodes.forEach(function(node) {
      fork.appendChild(node);
    });
    parent.parentNode.insertBefore(fork, parent.nextSibling);
    return fork;
  }
  return null;
};
export { splitNode };
