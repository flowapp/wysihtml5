import { nodeList } from "../dom/node_list";

var parentNodeClosestToNode = function(node, parentNode) {
  var parent = node.parentNode;
  if (parent === parentNode) {
    return node;
  }
  if (!parent) {
    return null;
  }
  return parentNodeClosestToNode(parent, parentNode);
};

var nodesBetweenSiblings = function(first, second) {
  var parent = first.parentNode;
  var children = nodeList.toArray(parent.childNodes);
  return children.slice(children.indexOf(first), children.indexOf(second) + 1);
}

var selectedNodesClosestTo = function(range, parent) {
  var startContainer = range.startContainer;
  var endContainer = range.endContainer;

  if (startContainer === endContainer) {
    return [parentNodeClosestToNode(startContainer, parent) || parent.firstElementChild];
  } else {
    var start = parentNodeClosestToNode(startContainer, parent) || parent.firstElementChild;
    var end = parentNodeClosestToNode(endContainer, parent) || parent.lastElementChild;
    return nodesBetweenSiblings(start, end);
  }
}

export { selectedNodesClosestTo }
