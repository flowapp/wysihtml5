import { formatInline } from "./formatInline";
import { nativeCommand } from "./native_command";

var bold = {
  exec: function(composer, command) {
    nativeCommand.exec(composer, "bold");
  },

  state: function(composer, command) {
    return formatInline.state(composer, command, "b");
  }
};

export { bold };
