var normalize = function(node) {
  node.normalize();
  var uneditableNodes = node.querySelectorAll("[contenteditable='false']");

  for(var i = 0; i < uneditableNodes.length; i++) {
    var childNode = uneditableNodes[i];
    childNode.parentNode.insertBefore(document.createTextNode(""), childNode.nextSibling);
  }
}

export {normalize};
