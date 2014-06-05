/**
 * Checks for nodes with no text inside and removes them
 *
 * @param {Element} node The element in which to cleanup
 * @example
 *    wysihtml5.dom.removeEmptyNodes(element);
 */

var removeEmptyNodes = function(node) {
  var index, lastNodeIndex, element;
  element = node.cloneNode(true);
  index = 0;
  while (index != element.childNodes.length) {
    var nodeContainsImage, nodeHasTextContent;
    var node = element.childNodes[index];
    if (node) {
      nodeContainsImage = node.nodeName == "IMG" || (node.nodeType == 1 && node.querySelector("img"));
      nodeHasTextContent = (node.textContent || "").trim();
    }

    if (!nodeContainsImage && !nodeHasTextContent) {
      element.removeChild(node);
    } else {
      index++;
    }
  }

  return element;
};

export { removeEmptyNodes };
