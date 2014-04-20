import NativeInlineCommand from "./native_inline_command";

var UnderlineCommand = NativeInlineCommand.extend({
  command: "underline",
  tagName: "u"
});

export default = UnderlineCommand;
