var toArray = function(nodeList) {
  var nodes = [];
  var length = nodeList.length;
  for (var index = 0; index < length; index++) {
    nodes.push(nodeList[index]);
  }
  return nodes;
}

var toFragment = function(nodeList) {
  var nodes = toArray(nodeList);
  var fragment = document.createDocumentFragment();
  var length = nodes.length;
  for (var index = 0; index < length; index++) {
    fragment.appendChild(nodes[index]);
  }
  return fragment;
}

var nodeList = {
  toArray: toArray,
  toFragment: toFragment
};

export { nodeList };
