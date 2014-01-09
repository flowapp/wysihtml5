/**
 * Checks for trailing line breaks and removes them
 *
 * @param {Element} node The element in which to cleanup
 * @example
 *    wysihtml5.dom.removeTrailingLineBreaks(element);
 */
import lang from "wysihtml5/lang";

var removeTrailingLineBreaks = function(node) {
  var childNodes = lang.array(node.querySelectorAll("br:last-child")).get();
  for (var index = 0; index < childNodes.length; index++) {
    var childNode = childNodes[index];
    childNode.parentNode.removeChild(childNode);
  }

  return node;
};

export { removeTrailingLineBreaks };
