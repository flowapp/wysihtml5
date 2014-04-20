import { InlineCommand } from "./inline_command";
import { formatInline } from "../commands_deprecated/formatInline";

var NativeInlineCommand = InlineCommand.extend({
  command: "bold",
  tagName: "b",
  state: function() {
    return formatInline.state(this.composer, this.command, this.tagName);
  },

  exec: function() {
    this._exec();
  },

  unexec: function() {
    this._exec();
  },

  _exec: function() {
    var command = this.command;
    var entireRange = this.composer.selection.getRange();
    var ranges = this.composer.selection.getOwnRanges();
    if (ranges.length) {
      ranges.forEach(function(range) {
        this.composer.selection.setSelection(range);
        document.execCommand(command, false, null);
      }.bind(this));
      if (!entireRange.collapsed && ranges.length > 1) {
        var range = document.createRange()
        range.setStart(entireRange.startContainer, entireRange.startOffset);
        range.setEnd(entireRange.endContainer, entireRange.endOffset);
        this.composer.selection.setSelection(range);
      }
    }
  }
});

export default = NativeInlineCommand;
