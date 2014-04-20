import FormatBlockCommand from "./format_block_command";
import { Constants } from "../constants";

var HeaderCommand = FormatBlockCommand.extend({
  _nodeName: function(nodeName) {
    return nodeName ? this.base(nodeName) : Constants.HEADER_ELEMENTS
  }
});

export default = HeaderCommand;
