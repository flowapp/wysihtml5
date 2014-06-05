import { nodeList } from "./node_list";

var appendChildNodes = function(node, newParent, trailing) {
  var fragment;

  if (node.nodeType == Node.DOCUMENT_FRAGMENT_NODE || !node.childNodes.length) {
    fragment = node;
  } else {
    fragment = nodeList.toFragment(node.childNodes);
  }

  var firstChild = newParent.firstChild;
  if (trailing === false && firstChild) {
    newParent.insertBefore(fragment, firstChild);
  } else {
    newParent.appendChild(fragment);
  }
  fragment = null;
};

export { appendChildNodes };
