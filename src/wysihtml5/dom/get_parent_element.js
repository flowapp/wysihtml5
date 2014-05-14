/**
 * Walks the dom tree from the given node up until it finds a match
 * Designed for optimal performance.
 *
 * @param {Element} node The from which to check the parent nodes
 * @param {Object} matchingSet Object to match against (possible properties: nodeName, className, classRegExp)
 * @param {Number} [levels] How many parents should the function check up from the current node (defaults to 50)
 * @return {null|Element} Returns the first element that matched the desiredNodeName(s)
 * @example
 *    var listElement = wysihtml5.dom.getParentElement(document.querySelector("li"), { nodeName: ["MENU", "UL", "OL"] });
 *    // ... or ...
 *    var unorderedListElement = wysihtml5.dom.getParentElement(document.querySelector("li"), { nodeName: "UL" });
 *    // ... or ...
 *    var coloredElement = wysihtml5.dom.getParentElement(myTextNode, { nodeName: "SPAN", className: "wysiwyg-color-red", classRegExp: /wysiwyg-color-[a-z]/g });
 */
import lang from "wysihtml5/lang";

function _isSameNodeName(nodeName, desiredNodeNames) {
  if (!desiredNodeNames || !desiredNodeNames.length) {
    return true;
  }

  if (typeof(desiredNodeNames) === "string") {
    return nodeName === desiredNodeNames;
  } else {
    return lang.array(desiredNodeNames).contains(nodeName);
  }
}

function _isElement(node) {
  return node.nodeType === Node.ELEMENT_NODE;
}

function _hasClassName(element, className, classRegExp) {
  var classNames = (element.className || "").match(classRegExp) || [];
  if (!className) {
    return !!classNames.length;
  }
  return classNames[classNames.length - 1] === className;
}

function _while(node, options, callback) {
  var levels = options.levels || 50
  var until;
  if (options.until && options.until.contains(node)) {
    until = options.until;
  } else if (node && node.ownerDocument) {
    until = node.ownerDocument.body;
  }
  var results;
  while (levels-- && node && until && node !== until) {
    results = callback(node)
    if (results !== undefined) {
      return results;
    }
    node = node.parentNode;
  }
  return null
}

function _getParentElementWithNodeName(node, nodeName, options) {
  return _while(node, options, function(node) {
    if (_isSameNodeName(node.nodeName, nodeName)) {
      return node;
    }
  });
}

function _getParentElementWithNodeNameAndClassName(node, nodeName, className, classRegExp, levels) {
  return _while(node, options, function(node) {
    if (
      _isElement(node) &&
      _isSameNodeName(node.nodeName, nodeName) &&
      _hasClassName(node, className, classRegExp)
    ) {
      return node;
    }
  });
}

var getParentElement = function(node, matchingSet, options) {
  options = options || {};
  if (matchingSet.className || matchingSet.classRegExp) {
    return _getParentElementWithNodeNameAndClassName(
      node, matchingSet.nodeName, matchingSet.className, matchingSet.classRegExp, options
    );
  } else {
    return _getParentElementWithNodeName(node, matchingSet.nodeName, options);
  }
};

export { getParentElement };
