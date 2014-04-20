import NativeInlineCommand from "./native_inline_command";

var ItalicCommand = NativeInlineCommand.extend({
  command: "italic",
  tagName: "i"
});

export default = ItalicCommand;
