import { BlockCommand } from "./block_command";
import { listCleanup } from "../helpers/list_cleanup";

// DOM helpers
import { renameElement } from "../dom/rename_element";
import convertListItemsIntoParagraphs from "../helpers/convert_list_item_into_paragraph";

var ListCommand = BlockCommand.extend({
  exec: function() {
    var selectedNode = this.composer.selection.getSelectedNode();
    var oppositeList = this.composer.parentElement(selectedNode, {
      nodeName: this._oppositeTagName()
    });
    if (oppositeList) {
      this.composer.selection.executeAndRestore(function() {
        renameElement(oppositeList, this.tagName);
      }.bind(this));
    } else {
      document.execCommand(this.command, false, null);
      listCleanup(this.composer);
    }
  },

  unexec: function() {
    var selectedListItems = this.composer.selection.findNodesByType(["LI"]);
    if (selectedListItems.length) {
      this.composer.selection.executeAndRestoreSimple(function() {
        convertListItemsIntoParagraphs(selectedListItems);
      });
    }
  },

  state: function() {
    var selectedNode = this.composer.selection.getSelectedNode();
    if (selectedNode) {
      return this.composer.parentElement(selectedNode, {
        nodeName: this.tagName
      }) || false;
    }
    return false;
  },

  shouldUnapplyForCommand: function(command) {
    if (command instanceof ListCommand) {
      return false;
    }
    return this.base(command);
  },

  _oppositeTagName: function() {
    return this.tagName === "OL" ? "UL" : "OL";
  }
});

export default = ListCommand;
