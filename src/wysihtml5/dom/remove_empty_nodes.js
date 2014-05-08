/**
 * Checks for nodes with no text inside and removes them
 *
 * @param {Element} node The element in which to cleanup
 * @example
 *    wysihtml5.dom.removeEmptyNodes(element);
 */

var removeEmptyNodes = function(node) {
  var index, lastNodeIndex, element, firstNode, lastNode, firstNodeText, lastNodeText;
  element = node.cloneNode(true);
  index = 0;
  while (element.childNodes.length) {
    lastNodeIndex = Math.max(element.childNodes.length - 1, 0)
    firstNode = element.childNodes[index];
    lastNode = element.childNodes[lastNodeIndex];
    firstNodeText = (firstNode.textContent || "").trim();
    lastNodeText = (lastNode.textContent || "").trim();

    if (!firstNodeText) {
      element.removeChild(firstNode);
    } else {
      index++;
    }

    if (!lastNodeText && lastNode != firstNode) {
      element.removeChild(lastNode);
    }

    if (index >= lastNodeIndex) {
      break;
    }
  }

  return element;
};

export { removeEmptyNodes };
