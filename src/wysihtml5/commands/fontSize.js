/**
 * document.execCommand("fontSize") will create either inline styles (firefox, chrome) or use font tags
 * which we don't want
 * Instead we set a css class
 */

import { formatInline } from "./formatInline";

var REG_EXP = /wysiwyg-font-size-[0-9a-z\-]+/g;

var fontSize = {
  exec: function(composer, command, size) {
    formatInline.exec(composer, command, "span", "wysiwyg-font-size-" + size, REG_EXP);
  },

  state: function(composer, command, size) {
    return formatInline.state(composer, command, "span", "wysiwyg-font-size-" + size, REG_EXP);
  }
};

export { fontSize };
