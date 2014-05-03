import MIMEParse from "./mime_parser";
import { fromPlainText } from "../helpers/from_plain_text";

var NEW_LINE_REGEX = /\n+/;

var PlainParser = MIMEParse.extend({
  toNodeList: function(content) {
    var fragment = content.split(NEW_LINE_REGEX);
    for (var index = 0; index < fragment.length; index++) {
      fragment[index] = document.createTextNode(fragment[index]);
    }
    return fragment;
  },

  fromDocumentFragment: function() {

  }
});

export default = PlainParser;
