import dom from "../dom";
import { Constants } from "../constants";
import { formatInline } from "./formatInline";

var undef,
    NODE_NAME = "A";

function _removeFormat(composer, anchors) {
  var length  = anchors.length,
      i       = 0,
      anchor,
      codeElement,
      textContent;
  for (; i<length; i++) {
    anchor      = anchors[i];
    codeElement = composer.parentElement(anchor, { nodeName: "code" });
    textContent = dom.getTextContent(anchor);

    // if <a> contains url-like text content, rename it to <code> to prevent re-autolinking
    // else replace <a> with its childNodes
    if (textContent.match(Constants.URL_REG_EXP) && !codeElement) {
      // <code> element is used to prevent later auto-linking of the content
      codeElement = dom.renameElement(anchor, "code");
    } else {
      dom.replaceWithChildNodes(anchor);
    }
  }
}

function _format(composer, attributes) {
  var doc             = composer.doc,
      tempClass       = "_wysihtml5-temp-" + (+new Date()),
      tempClassRegExp = /non-matching-class/g,
      i               = 0,
      length,
      anchors,
      anchor,
      hasElementChild,
      isEmpty,
      elementToSetCaretAfter,
      textContent,
      whiteSpace,
      j;

  formatInline.exec(composer, undef, NODE_NAME, tempClass, tempClassRegExp);
  anchors = doc.querySelectorAll(NODE_NAME + "." + tempClass);
  length  = anchors.length;
  for (; i<length; i++) {
    anchor = anchors[i];
    anchor.removeAttribute("class");
    for (j in attributes) {
      anchor.setAttribute(j, attributes[j]);
    }
  }

  elementToSetCaretAfter = anchor;
  if (length === 1) {
    textContent = dom.getTextContent(anchor);
    hasElementChild = !!anchor.querySelector("*");
    isEmpty = textContent === "" || textContent === Constants.INVISIBLE_SPACE;
    if (!hasElementChild && isEmpty) {
      dom.setTextContent(anchor, attributes.text || anchor.href);
      whiteSpace = doc.createTextNode(" ");
      composer.selection.setAfter(anchor);
      dom.insert(whiteSpace).after(anchor);
      elementToSetCaretAfter = whiteSpace;
    }
  }
  composer.selection.setAfter(elementToSetCaretAfter);
  return anchors;
}

var createLink = {
  /**
   * TODO: Use HTMLApplier or formatInline here
   *
   * Turns selection into a link
   * If selection is already a link, it removes the link and wraps it with a <code> element
   * The <code> element is needed to avoid auto linking
   *
   * @example
   *    // either ...
   *    wysihtml5.commands.createLink.exec(composer, "createLink", "http://www.google.de");
   *    // ... or ...
   *    wysihtml5.commands.createLink.exec(composer, "createLink", { href: "http://www.google.de", target: "_blank" });
   */
  exec: function(composer, command, value) {
    var anchors = this.state(composer, command);
    if (anchors) {
      // Selection contains links
      composer.selection.executeAndRestore(function() {
        _removeFormat(composer, anchors);
      });
    } else {
      // Create links
      value = typeof(value) === "object" ? value : { href: value };
      return _format(composer, value);
    }
  },

  state: function(composer, command) {
    return formatInline.state(composer, command, "A");
  }
};

export { createLink };
