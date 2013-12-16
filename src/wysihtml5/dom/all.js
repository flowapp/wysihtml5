var allNodes = function(filter) {
  return function(node) {
    var acceptNode = function(node) {
      return NodeFilter.FILTER_ACCEPT;
    };
    acceptNode.acceptNode = acceptNode;
    var treeWalker = document.createTreeWalker(
      node,
      filter,
      acceptNode,
      false
    );

    var nodeList = [];
    while (treeWalker.nextNode()) {
      nodeList.push(treeWalker.currentNode);
    }
    return nodeList;
  }
}

var all = {
  elements: allNodes(NodeFilter.SHOW_ELEMENT),
  textNodes: allNodes(NodeFilter.SHOW_TEXT)
}

export {all};
