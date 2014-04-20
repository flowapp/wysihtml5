import { BlockCommand } from "./block_command";
import { Commands } from "../commands";

// DOM helpers
import { formatInline } from "../commands_deprecated/formatInline";
import { nodeList } from "../dom/node_list";
import { replaceWithChildNodes } from "../dom/replace_with_child_nodes";
import { appendChildNodes } from "../dom/append_child_nodes";

// Helpers
import { convertNestedBlockquoteIntoParagraph } from "../helpers/convert_nested_blockquote_into_paragraph";
import { selectedNodesClosestTo } from "../helpers/selected_nodes_closest_to";

var BlockquoteCommand = BlockCommand.extend({
  shouldUnapplyForCommand: function(command) {
    return false;
  },
  state: function() {
    return !!formatInline.state(this.composer, undefined, "blockquote").length;
  },

  exec: function() {
    var range = this.composer.selection.getRange();
    var commonAncestorContainer = range.commonAncestorContainer;
    var childNodes = selectedNodesClosestTo(range, this.composer.element);
    var insertBefore = childNodes[childNodes.length - 1].nextElementSibling;
    var previousContainer = childNodes[0].previousElementSibling;

    var fragment = document.createDocumentFragment();
    childNodes.forEach(function(child) {
      fragment.appendChild(child);
    });

    if (previousContainer && previousContainer.nodeName === "BLOCKQUOTE") {
      previousContainer.appendChild(fragment);
      if (insertBefore && insertBefore.nodeName === "BLOCKQUOTE") {
        appendChildNodes(insertBefore, previousContainer);
        insertBefore.parentNode.removeChild(insertBefore);
      }
    } else if (insertBefore && insertBefore.nodeName === "BLOCKQUOTE") {
      insertBefore.insertBefore(fragment, insertBefore.firstChild);
    } else {
      var blockquote = document.createElement("blockquote");
      blockquote.appendChild(fragment);
      this.composer.element.insertBefore(blockquote, insertBefore);
    }
    var selection = document.createRange();
    selection.setStart(range.startContainer, range.startOffset);
    selection.setEnd(range.endContainer, range.endOffset);
    this.composer.selection.setSelection(selection);
  },

  unexec: function() {
    var range = this.composer.selection.getRange();
    this.composer.selection.executeAndRestoreSimple(function() {
      this._unwrap(range, this.composer);
    }.bind(this));
  },

  _unwrap: function(range) {
    var childNodes = selectedNodesClosestTo(range, this.composer.element);
    var startContainer = range.startContainer;
    var endContainer = range.endContainer;
    childNodes.forEach(function(node) {
      if (node.nodeName === "BLOCKQUOTE") {
        var start = node.contains(startContainer);
        var end = node.contains(endContainer);
        if (start && end) {
          this._replaceChildNodes(node, startContainer, endContainer);
        } else if (start) {
          this._replaceChildNodes(node, startContainer, undefined);
        } else if (end) {
          this._replaceChildNodes(node, undefined, endContainer);
        } else {
          this._replaceWithChildNodes(node);
        }
      }
    }.bind(this));
  },

  _replaceChildNodes: function(node, startContainer, endContainer) {
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
  }
});

export default = BlockquoteCommand;
