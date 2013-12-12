/**
 * Checks for nodes with no text inside and removes them
 *
 * @param {Element} node The element in which to cleanup
 * @example
 *    wysihtml5.dom.removeEmptyNodes(element);
 */

var removeEmptyNodes = function(node) {
  var element, firstNode, lastNode, firstNodeText, lastNodeText;
  element = node.cloneNode(true);

  while (element.childNodes.length) {
    firstNode = element.childNodes[0];
    lastNode = element.childNodes[element.childNodes.length - 1];
    firstNodeText = (firstNode.textContent || "").trim();
    lastNodeText = (lastNode.textContent || "").trim();

    if (!firstNodeText) {
      element.removeChild(firstNode);
    }

    if (!lastNodeText && lastNode != firstNode) {
      element.removeChild(lastNode);
    }

    if (firstNodeText && lastNodeText) {
      break;
    }
  }

  return element;
};

export { removeEmptyNodes };
