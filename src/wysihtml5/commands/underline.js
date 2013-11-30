import { formatInline } from "./formatInline";

var underline = {
  exec: function(composer, command) {
    formatInline.exec(composer, command, "u");
  },

  state: function(composer, command) {
    return formatInline.state(composer, command, "u");
  }
};

export { underline };