import dom from "../dom";
import lang from "wysihtml5/lang";
import { browser } from "../browser";
import { Constants } from "../constants";

var BLOCK_ELEMENTS_GROUP = ["H1", "H2", "H3", "H4", "H5", "H6", "P", "PRE", "BLOCKQUOTE", "DIV"];

/**
 * Remove similiar classes (based on classRegExp)
 * and add the desired class name
 */
function _addClass(element, className, classRegExp) {
  if (element.className) {
    _removeClass(element, classRegExp);
    element.className = lang.string(element.className + " " + className).trim();
  } else {
    element.className = className;
  }
}

function _removeClass(element, classRegExp) {
  var ret = classRegExp.test(element.className);
  element.className = element.className.replace(classRegExp, "");
  if (lang.string(element.className).trim() == '') {
      element.removeAttribute('class');
  }
  return ret;
}

/**
 * Check whether given node is a text node and whether it's empty
 */
function _isBlankTextNode(node) {
  return node.nodeType === Node.TEXT_NODE && !lang.string(node.data).trim();
}

/**
 * Returns previous sibling node that is not a blank text node
 */
function _getPreviousSiblingThatIsNotBlank(node) {
  var previousSibling = node.previousSibling;
  while (previousSibling && _isBlankTextNode(previousSibling)) {
    previousSibling = previousSibling.previousSibling;
  }
  return previousSibling;
}

/**
 * Returns next sibling node that is not a blank text node
 */
function _getNextSiblingThatIsNotBlank(node) {
  var nextSibling = node.nextSibling;
  while (nextSibling && _isBlankTextNode(nextSibling)) {
    nextSibling = nextSibling.nextSibling;
  }
  return nextSibling;
}

/**
 * Adds line breaks before and after the given node if the previous and next siblings
 * aren't already causing a visual line break (block element or <br>)
 */
function _addLineBreakBeforeAndAfter(node) {
  var doc             = node.ownerDocument,
      nextSibling     = _getNextSiblingThatIsNotBlank(node),
      previousSibling = _getPreviousSiblingThatIsNotBlank(node);

  if (nextSibling && !_isLineBreakOrBlockElement(nextSibling)) {
    node.parentNode.insertBefore(doc.createElement("br"), nextSibling);
  }
  if (previousSibling && !_isLineBreakOrBlockElement(previousSibling)) {
    node.parentNode.insertBefore(doc.createElement("br"), node);
  }
}

/**
 * Removes line breaks before and after the given node
 */
function _removeLineBreakBeforeAndAfter(node) {
  var nextSibling     = _getNextSiblingThatIsNotBlank(node),
      previousSibling = _getPreviousSiblingThatIsNotBlank(node);

  if (nextSibling && _isLineBreak(nextSibling)) {
    nextSibling.parentNode.removeChild(nextSibling);
  }
  if (previousSibling && _isLineBreak(previousSibling)) {
    previousSibling.parentNode.removeChild(previousSibling);
  }
}

function _removeLastChildIfLineBreak(node) {
  var lastChild = node.lastChild;
  if (lastChild && _isLineBreak(lastChild)) {
    lastChild.parentNode.removeChild(lastChild);
  }
}

function _isLineBreak(node) {
  return node.nodeName === "BR";
}

/**
 * Checks whether the elment causes a visual line break
 * (<br> or block elements)
 */
function _isLineBreakOrBlockElement(element) {
  if (_isLineBreak(element)) {
    return true;
  }

  if (dom.getStyle("display").from(element) === "block") {
    return true;
  }

  return false;
}

function _hasClasses(element) {
  return !!lang.string(element.className).trim();
}

var formatBlock = {
  exec: function(composer, command, nodeName, className, classRegExp) {
    var doc             = composer.doc,
        blockElements    = this.state(composer, command, nodeName, className, classRegExp),
        useLineBreaks   = composer.config.useLineBreaks,
        defaultNodeName = useLineBreaks ? "DIV" : "P",
        selectedNodes, classRemoveAction, blockRenameFound;

    nodeName = typeof(nodeName) === "string" ? nodeName.toUpperCase() : nodeName;
    if (blockElements.length) {
      composer.selection.executeAndRestoreSimple(function() {
        for (var b = blockElements.length; b--;) {
          if (classRegExp) {
            classRemoveAction = _removeClass(blockElements[b], classRegExp);
          }

          if (classRemoveAction && nodeName === null && blockElements[b].nodeName != defaultNodeName) {
            // dont rename or remove element when just setting block formating class
            return;
          }

          var hasClasses = _hasClasses(blockElements[b]);

          if (!hasClasses && (useLineBreaks || nodeName === "P")) {
            // Insert a line break afterwards and beforewards when there are siblings
            // that are not of type line break or block element
            _addLineBreakBeforeAndAfter(blockElements[b]);
            dom.replaceWithChildNodes(blockElements[b]);
          } else if (nodeName === "PRE") {
            var element = blockElements[b];
            var content = element.innerHTML;
            var paragraphs = dom.fromPlainText(content, true);
            var fragment = dom.nodeList.toFragment(paragraphs);
            element.parentNode.replaceChild(fragment, element);
          } else {
            // Make sure that styling is kept by renaming the element to a <div> or <p> and copying over the class name
            dom.renameElement(blockElements[b], nodeName === "P" ? "DIV" : defaultNodeName);
          }
        }
      });

      return;
    }

    if (nodeName === null || lang.array(BLOCK_ELEMENTS_GROUP).contains(nodeName)) {
      if (nodeName == "PRE") {
        var node = composer.selection.surround({nodeName: "PRE"});
        if (node) {
          var children = dom.all.elements(node);
          children.reverse().forEach(function(child) {
            if (child.nodeName == "BR") {
              child.parentNode.replaceChild(document.createTextNode("\n"), child);
            } else {
              if (Constants.BLOCK_ELEMENTS.indexOf(child.nodeName) != -1 && node.lastChild != child) {
                child.innerHTML += "\n\n";
              }
              dom.replaceWithChildNodes(child);
            }
          });
        }
        return;
      }

      // Find similiar block element and rename it (<h2 class="foo"></h2>  =>  <h1 class="foo"></h1>)
      selectedNodes = composer.selection.findNodesInSelection(BLOCK_ELEMENTS_GROUP).concat(composer.selection.getSelectedOwnNodes());

      composer.selection.executeAndRestoreSimple(function() {
        for (var n = selectedNodes.length; n--;) {
          var blockElement = dom.getParentElement(selectedNodes[n], {
            nodeName: BLOCK_ELEMENTS_GROUP
          });
          if (blockElement == composer.element) {
            continue;
          }
          if (blockElement) {
            // Rename current block element to new block element and add class
            if (nodeName) {
              blockElement = dom.renameElement(blockElement, nodeName);
            }
            if (className) {
              _addClass(blockElement, className, classRegExp);
            }
          }
        }
      });
    }
  },

  state: function(composer, command, nodeName, className, classRegExp) {
    var nodes = composer.selection.getSelectedOwnNodes(),
        parents = [],
        parent;

    nodeName = typeof(nodeName) === "string" ? nodeName.toUpperCase() : nodeName;

    //var selectedNode = composer.selection.getSelectedNode();
    for (var i = 0, maxi = nodes.length; i < maxi; i++) {
      parent = dom.getParentElement(nodes[i], {
        nodeName: nodeName,
        className: className,
        classRegExp: classRegExp
      });
      if (parent && lang.array(parents).indexOf(parent) == -1) {
        parents.push(parent);
      }
    }
    if (parents.length == 0) {
      return false;
    }
    return parents;
  }
};

export { formatBlock };
