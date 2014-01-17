import dom from "../dom";
import lang from "wysihtml5/lang";
import { Constants } from "../constants";
import { formatInline } from "./formatInline";
import { fromPlainText } from "../helpers/from_plain_text";
import { toPlainText } from "../helpers/to_plain_text";
import { selectedNodesClosestTo } from "../helpers/selected_nodes_closest_to";

var pre = {
  exec: function(composer, command, nodeName, className, classRegExp) {
    var blockElements = this.state(composer, command, nodeName, className, classRegExp);

    nodeName = typeof(nodeName) === "string" ? nodeName.toUpperCase() : nodeName;
    if (blockElements.length) {
      composer.selection.executeAndRestoreSimple(function() {
        for (var index = blockElements.length; index >= 0; index--) {
          var element = blockElements[index];
          if (element && element.parentNode) {
            var content = element.innerHTML;
            var paragraphs = fromPlainText(content, true);
            var fragment = dom.nodeList.toFragment(paragraphs);
            element.parentNode.replaceChild(fragment, element);
          }
        }
      });
    } else {
      var selectedNode = composer.selection.getSelectedNode();
      var range = composer.selection.getRange();
      var parent = composer.parentElement(selectedNode, {nodeName: ["DIV", "BLOCKQUOTE"]});
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
    }
  },

  state: function(composer, command, nodeName, className, classRegExp) {
    return formatInline.state(composer, "formatBlock", "pre");
  }
};

export { pre };
