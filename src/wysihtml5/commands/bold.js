import { formatInline } from "./formatInline";

var bold = {
  exec: function(composer, command) {
    formatInline.exec(composer, command, "b");
  },

  state: function(composer, command) {
    return formatInline.state(composer, command, "b");
  }
};

export { bold };