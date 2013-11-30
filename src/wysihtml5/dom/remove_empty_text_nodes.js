/**
 * Checks for empty text node childs and removes them
 *
 * @param {Element} node The element in which to cleanup
 * @example
 *    wysihtml5.dom.removeEmptyTextNodes(element);
 */
import lang from "wysihtml5/lang";

var removeEmptyTextNodes = function(node) {
  var childNode,
      childNodes        = lang.array(node.childNodes).get(),
      childNodesLength  = childNodes.length,
      i                 = 0;
  for (; i<childNodesLength; i++) {
    childNode = childNodes[i];
    if (childNode.nodeType === Node.TEXT_NODE && childNode.data === "") {
      childNode.parentNode.removeChild(childNode);
    }
  }
};

export { removeEmptyTextNodes };