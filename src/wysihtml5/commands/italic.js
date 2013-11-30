import { formatInline } from "./formatInline";

var italic = {
  exec: function(composer, command) {
    formatInline.exec(composer, command, "i");
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