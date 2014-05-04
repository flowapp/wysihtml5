import FormatBlockCommand from "./format_block_command";

var ParagraphCommand = FormatBlockCommand.extend({
  parsingRules: {
    p: {},
    div: {
      rename_tag: "p"
    }
  },

  unexec: function() {
    return [];
  },

  _nodeName: function() {
    return "P"
  }
});

export default = ParagraphCommand;
