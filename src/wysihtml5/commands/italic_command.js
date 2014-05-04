import NativeInlineCommand from "./native_inline_command";

var ItalicCommand = NativeInlineCommand.extend({
  parsingRules: {
    em: {},
    i: {
      rename_tag: "em"
    }
  },
  command: "italic",
  tagName: "i"
});

export default = ItalicCommand;
