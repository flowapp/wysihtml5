/**
 * Checks for nodes with no text inside and removes them
 *
 * @param {Element} node The element in which to cleanup
 * @example
 *    wysihtml5.dom.removeEmptyNodes(element);
 */

import { nodeList } from "../dom/node_list";

var removeEmptyNodes = function(node) {
  var element = node.cloneNode(true);
  var nodes = nodeList.toArray(element.childNodes);
  for (var index = 0; index < nodes.length; index++) {
    var node = nodes[index];
    if (node) {
      var nodeContainsImage = node.nodeName == "IMG" || (node.nodeType == Node.ELEMENT_NODE && node.querySelector("img"));
      var nodeHasTextContent = (node.textContent || "").trim();
      if (!nodeContainsImage && !nodeHasTextContent) {
        var nodeContainsLineBreak = node.nodeName == "BR" || (node.nodeType == Node.ELEMENT_NODE && node.querySelector("br"));

        if (nodeContainsLineBreak) {
          var totalLineBreaks = node.nodeType == Node.ELEMENT_NODE ? node.querySelectorAll("br").length : 1;
          for (var lineBreakIndex = 0; lineBreakIndex < totalLineBreaks; lineBreakIndex++) {
            element.insertBefore(document.createElement("br"), node);
          }
        }

        element.removeChild(node);
      }
    }
  };
  return element;
};

export { removeEmptyNodes };
