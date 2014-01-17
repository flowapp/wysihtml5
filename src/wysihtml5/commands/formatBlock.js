import dom from "../dom";
import lang from "wysihtml5/lang";
import { Constants } from "../constants";
import { fromPlainText } from "../helpers/from_plain_text";

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

var formatBlock = {
  exec: function(composer, command, nodeName, className, classRegExp) {
    var blockElements = this.state(composer, command, nodeName, className, classRegExp);
    var defaultNodeName = "P";
    var classRemoveAction;

    nodeName = typeof(nodeName) === "string" ? nodeName.toUpperCase() : nodeName;
    nodeName = nodeName || "P";

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
          dom.renameElement(blockElements[b], nodeName === "P" ? "DIV" : defaultNodeName);
        }
      });
    } else if (nodeName === null || lang.array(BLOCK_ELEMENTS_GROUP).contains(nodeName)) {
      // Find similiar block element and rename it (<h2 class="foo"></h2>  =>  <h1 class="foo"></h1>)
      var selectedNodes = composer.selection.findNodesInSelection(BLOCK_ELEMENTS_GROUP);
      selectedNodes = selectedNodes.concat(composer.selection.getSelectedOwnNodes());

      composer.selection.executeAndRestoreSimple(function() {
        for (var n = selectedNodes.length; n--;) {
          var blockElement = composer.parentElement(selectedNodes[n], {
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
    var nodes = composer.selection.getSelectedOwnNodes();
    var parents = [];

    nodeName = typeof(nodeName) === "string" ? nodeName.toUpperCase() : nodeName;

    for (var i = 0, maxi = nodes.length; i < maxi; i++) {
      var parent = composer.parentElement(nodes[i], {
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
