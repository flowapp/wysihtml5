import { InlineCommand } from "./inline_command";
import { formatInline } from "../commands_deprecated/formatInline";
import { Constants } from "../constants";

// DOM helpers
import { renameElement } from "../dom/rename_element";
import { replaceWithChildNodes } from "../dom/replace_with_child_nodes";

var NODE_NAME = "A";

var LinkCommand = InlineCommand.extend({
  state: function() {
    return !!formatInline.state(this.composer, "createLink", "A").length;
  },

  exec: function(value) {
    value = typeof(value) === "object" ? value : {href: value};
    return this._createFormat(value);
  },

  unexec: function() {
    var anchors = formatInline.state(this.composer, "createLink", "A");
    this._removeFormat(anchors);
  },

  _createFormat: function(attributes) {
    var tempClass = "_wysihtml5-temp-" + (+new Date());
    var tempClassRegExp = /non-matching-class/g;

    formatInline.exec(this.composer, undefined, NODE_NAME, tempClass, tempClassRegExp);
    var anchors = this.composer.element.querySelectorAll(NODE_NAME + "." + tempClass);
    var length = anchors.length;
    for (var index = 0; index < length; index++) {
      var anchor = anchors[index];
      anchor.removeAttribute("class");
      for (var j in attributes) {
        anchor.setAttribute(j, attributes[j]);
      }
    }

    var elementToSetCaretAfter = anchor;
    if (length === 1) {
      var textContent = anchor.textContent;
      var hasElementChild = !!anchor.querySelector("*");
      var isEmpty = textContent === "" || textContent === Constants.INVISIBLE_SPACE;
      if (!hasElementChild && isEmpty) {
        anchor.textContent = attributes.text || anchor.href;
        var whiteSpace = document.createTextNode(" ");
        this.composer.selection.setAfter(anchor);
        anchor.parentNode.insertBefore(whiteSpace, anchor.nextSibling)
        elementToSetCaretAfter = whiteSpace;
      }
    }
    this.composer.selection.setAfter(elementToSetCaretAfter);
    return anchors;
  },

  _removeFormat: function(anchors) {
    var length = anchors.length;
    for (var index = 0; index < length; index++) {
      var anchor = anchors[index];
      var codeElement = this.composer.parentElement(anchor, { nodeName: "code" });
      var textContent = anchor.textContent;

      // if <a> contains url-like text content, rename it to <code> to prevent re-autolinking
      // else replace <a> with its childNodes
      if (textContent.match(Constants.URL_REG_EXP) && !codeElement) {
        // <code> element is used to prevent later auto-linking of the content
        spanElement = renameElement(anchor, "span");
      } else {
        replaceWithChildNodes(anchor);
      }
    }

  }
});

export default = LinkCommand;
