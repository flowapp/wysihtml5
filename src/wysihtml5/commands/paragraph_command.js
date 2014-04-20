import FormatBlockCommand from "./format_block_command";

var ParagraphCommand = FormatBlockCommand.extend({
  unexec: function() {
    return [];
  },

  _nodeName: function() {
    return "P"
  }
});

export default = ParagraphCommand;
