import NativeInlineCommand from "./native_inline_command";

var BoldCommand = NativeInlineCommand.extend({
  parsingRules: {
    strong: {},
    b: {
      rename_tag: "strong"
    }
  },
  command: "bold",
  tagName: "b"
});

export default = BoldCommand;
