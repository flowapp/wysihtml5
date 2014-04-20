import FormatBlockCommand from "./format_block_command";
import { Constants } from "../constants";
import BlockquoteCommand from "./blockquote_command";

var HeaderCommand = FormatBlockCommand.extend({
  shouldUnapplyForCommand: function(command) {
    if (command instanceof BlockquoteCommand) {
      return false
    }
    return this.base(command);
  },

  _nodeName: function(nodeName) {
    return nodeName ? this.base(nodeName) : Constants.HEADER_ELEMENTS
  }
});

export default = HeaderCommand;
