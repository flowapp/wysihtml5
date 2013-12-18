import { formatInline } from "./formatInline";
import { nativeCommand } from "./native_command";

var underline = {
  exec: function(composer, command) {
    nativeCommand.exec(composer, "underline");
  },

  state: function(composer, command) {
    return formatInline.state(composer, command, "u");
  }
};

export { underline };
