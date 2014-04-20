import { BlockCommand } from "./block_command";
import { Commands } from "../commands";

import { nodeList } from "../dom/node_list";
import { formatInline } from "../commands_deprecated/formatInline";
import { fromPlainText } from "../helpers/from_plain_text";
import { toPlainText } from "../helpers/to_plain_text";
import { selectedNodesClosestTo } from "../helpers/selected_nodes_closest_to";


var PreCommand = BlockCommand.extend({
  state: function() {
    return !!formatInline.state(this.composer, undefined, "pre").length;
  },

  exec: function() {
    var selectedNode = this.composer.selection.getSelectedNode();
    var range = this.composer.selection.getRange();
    var parent = this.composer.parentElement(selectedNode, {nodeName: ["DIV", "BLOCKQUOTE"]});
    parent = parent || this.composer.element;
    var selectedNodes = selectedNodesClosestTo(range, parent);
    if (selectedNodes.length) {
      var next = selectedNodes[selectedNodes.length - 1].nextSibling;
      var pre = document.createElement("pre");
      selectedNodes.forEach(function(node) {
        pre.appendChild(node);
      });
      toPlainText(pre);
      parent.insertBefore(pre, next);
    }
  },

  unexec: function() {
    var blockElements = formatInline.state(this.composer, undefined, "pre");
    this.composer.selection.executeAndRestoreSimple(function() {
      for (var index = blockElements.length; index >= 0; index--) {
        var element = blockElements[index];
        if (element && element.parentNode) {
          var content = element.innerHTML;
          var paragraphs = fromPlainText(content, true);
          var fragment = nodeList.toFragment(paragraphs);
          element.parentNode.replaceChild(fragment, element);
        }
      }
    });
  }
});

export default = PreCommand;
