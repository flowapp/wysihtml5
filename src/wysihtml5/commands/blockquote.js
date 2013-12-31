import { formatBlock } from "./formatBlock";
import { formatInline } from "./formatInline";

import { nodeList } from "../dom/node_list";
import { replaceWithChildNodes } from "../dom/replace_with_child_nodes";
import { getParentElement } from "../dom/get_parent_element";
import { convertNestedBlockquoteIntoParagraph } from "../helpers/convert_nested_blockquote_into_paragraph";

var parentNodeClosestToNode = function(node, parentNode) {
  var parent = node.parentNode;
  if (parent === parentNode) {
    return node;
  }
  if (!parent) {
    return null;
  }
  return parentNodeClosestToNode(parent, parentNode);
};

var nodesBetweenSiblings = function(first, second) {
  var parent = first.parentNode;
  var children = nodeList.toArray(parent.childNodes);
  return children.slice(children.indexOf(first), children.indexOf(second) + 1);
}

var closest = function(startContainer, endContainer, parent) {
  if (startContainer === endContainer) {
    return [parentNodeClosestToNode(startContainer, parent) || parent.firstElementChild];
  } else {
    var start = parentNodeClosestToNode(startContainer, parent) || parent.firstElementChild;
    var end = parentNodeClosestToNode(endContainer, parent) || parent.lastElementChild;
    return nodesBetweenSiblings(start, end);
  }
}

var unwrap = function(startContainer, endContainer, composer) {
  var childNodes = closest(startContainer, endContainer, composer.element);
  childNodes.forEach(function(node) {
    if (node.nodeName === "BLOCKQUOTE") {
      var start = node.contains(startContainer);
      var end = node.contains(endContainer);
      if (start && end) {
        replaceChildNodes(node, startContainer, endContainer, composer);
      } else if (start) {
        replaceChildNodes(node, startContainer, undefined, composer);
      } else if (end) {
        replaceChildNodes(node, undefined, endContainer, composer);
      } else {
        replaceWithChildNodes(node);
      }
    }
  });
};

var replaceChildNodes = function(node, startContainer, endContainer, composer) {
  var parent = node.parentNode;
  var childNodes = nodeList.toArray(node.childNodes);
  for (var i = 0; i < childNodes.length; i++) {
    var childNode = childNodes[i];
    if (startContainer) {
      if (childNode.contains(startContainer)) {
        startContainer = null;
      } else {
        continue;
      }
    }
    convertNestedBlockquoteIntoParagraph(childNode);

    if (endContainer && childNode.contains(endContainer)) {
      break;
    }
  }
};

var blockquote = {
  exec: function(composer, command) {
    var blockquotes;
    if (blockquotes = composer.commands.state("blockquote")) {
      var range = composer.selection.getRange();
      composer.selection.executeAndRestoreSimple(function() {
        unwrap(range.startContainer, range.endContainer, composer);
      });
    } else {
      var range = composer.selection.getRange();
      var commonAncestorContainer = range.commonAncestorContainer;
      var childNodes = closest(range.startContainer, range.endContainer, composer.element);
      var insertBefore = childNodes[childNodes.length - 1].nextElementSibling;
      var blockquote = document.createElement("blockquote");

      childNodes.forEach(function(child) {
        blockquote.appendChild(child);
      });
      composer.element.insertBefore(blockquote, insertBefore);

      var selection = document.createRange();
      selection.setStart(range.startContainer, range.startOffset);
      selection.setEnd(range.endContainer, range.endOffset);
      composer.selection.setSelection(selection);
    }
  },

  state: function(composer) {
    return formatInline.state(composer, "formatBlock", "blockquote");
  }
};

export { blockquote };
