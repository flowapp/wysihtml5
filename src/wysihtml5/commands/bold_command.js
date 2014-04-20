import NativeInlineCommand from "./native_inline_command";

var BoldCommand = NativeInlineCommand.extend({
  command: "bold",
  tagName: "b"
});

export default = BoldCommand;
