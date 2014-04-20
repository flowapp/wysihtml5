import { BlockCommand } from "./block_command";

import { formatInline } from "../commands_deprecated/formatInline";
import { Constants } from "../constants";

// DOM helpers
import { hasElementWithTagName } from "../dom/has_element_with_tag_name";
import { renameElement } from "../dom/rename_element";

var FormatBlockCommand = BlockCommand.extend({
  get: function(nodeName) {
    var ranges = this.composer.selection.getOwnRanges();
    return this.nodeNameAppliedInRanges(nodeName, ranges);
  },

  state: function(nodeName) {
    nodeName = this._nodeName(nodeName);
    return this.nodeName(nodeName);
  },

  exec: function(nodeName) {
    nodeName = this._nodeName(nodeName);

    var selectedNodes = this.composer.selection.findNodesInSelection(Constants.BLOCK_ELEMENTS);
    selectedNodes = selectedNodes.concat(this.composer.selection.getSelectedOwnNodes());

    this.composer.selection.executeAndRestore(function() {
      for (var index = selectedNodes.length; index--;) {
        var blockElement = this.composer.parentElement(selectedNodes[index], {
          nodeName: Constants.BLOCK_ELEMENTS
        });
        if (blockElement) {
          if (blockElement == this.composer.element) {
            continue;
          }
          renameElement(blockElement, nodeName);
        }
      }
    }.bind(this));
  },

  unexec: function(nodeName) {
    nodeName = this._nodeName(nodeName);
    var blockElements = this.get(nodeName);
    this.composer.selection.executeAndRestoreSimple(function() {
      for (var index = blockElements.length; index--;) {
        renameElement(blockElements[index], Constants.DEFAULT_NODE_NAME);
      }
    });
  },

  _nodeName: function(nodeName) {
    return nodeName.toUpperCase();
  },

  _quickCheck: function(nodeNames) {
    nodeNames = Array.isArray(nodeNames) ? nodeNames : [nodeNames];
    for (var index = nodeNames.length - 1; index >= 0; index--) {
      if (hasElementWithTagName(this.composer.element, nodeNames[index])) {
        return true;
      }
    };
    return false;
  }
});

export default = FormatBlockCommand;
