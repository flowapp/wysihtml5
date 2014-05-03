import MIMEParse from "./mime_parser";
import { removeEmptyTextNodes } from "../dom/remove_empty_text_nodes";
import { nodeList } from "../dom/node_list";
import { fromPlainText } from "../helpers/from_plain_text";

var HTMLParser = MIMEParse.extend({
  toNodeList: function(content) {
    var host = document.createElement("div");
    host.innerHTML = content;
    this.composer.parent.parse(host);
    host.normalize();
    removeEmptyTextNodes(host);
    var fragment = nodeList.toArray(host.childNodes);

    for (var i = 0; i < fragment.length; i++) {
      if (fragment[i].nodeType == Node.TEXT_NODE) {
        fragment[i] = fromPlainText(fragment[i].textContent)[0];
      }
    }
    return fragment;
  },
  fromDocumentFragment: function() {

  }
});

export default = HTMLParser;
