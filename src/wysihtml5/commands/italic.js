import { formatInline } from "./formatInline";
import { nativeCommand } from "./native_command";

var italic = {
  exec: function(composer, command) {
    nativeCommand.exec(composer, "italic");
  },

  state: function(composer, command) {
    // element.ownerDocument.queryCommandState("italic") results:
    // firefox: only <i>
    // chrome:  <i>, <em>, <blockquote>, ...
    // ie:      <i>, <em>
    // opera:   only <i>
    return formatInline.state(composer, command, "i");
  }
};

export { italic };
