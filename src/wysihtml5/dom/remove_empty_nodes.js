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
    lastNodeIndex = Math.max(element.childNodes.length - 1, 0);
    firstNode = element.childNodes[index];
    lastNode = element.childNodes[lastNodeIndex];
    if(firstNode) {
      if(firstNode.nodeName == "IMG" || firstNode.querySelector("img")) {
        firstNodeText = true;
      } else {
        firstNodeText = (firstNode.textContent || "").trim();
      }
    } else {
      firstNodeText = ""
    }

    if(lastNode) {
      if(lastNode.nodeName == "IMG" || lastNode.querySelector("img")) {
        lastNodeText = true;
      } else {
        lastNodeText = (lastNode.textContent || "").trim();
      }
    } else {
      lastNodeText = ""
    }

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
