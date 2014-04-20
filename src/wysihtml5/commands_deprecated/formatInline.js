/**
 * formatInline scenarios for tag "B" (| = caret, [foo] = selected text)
 *
 *   #1 caret in unformatted text:
 *      abcdefg|
 *   output:
 *      abcdefg<b>|</b>
 *
 *   #2 unformatted text selected:
 *      abc|deg|h
 *   output:
 *      abc<b>[deg]</b>h
 *
 *   #3 unformatted text selected across boundaries:
 *      ab|c <span>defg|h</span>
 *   output:
 *      ab<b>[c </b><span><b>defg</b>]h</span>
 *
 *   #4 formatted text entirely selected
 *      <b>[abc]</b>
 *   output:
 *      [abc]
 *
 *   #5 formatted text partially selected
 *      <b>ab[c]</b>
 *   output:
 *      <b>ab</b>[c]
 *
 *   #6 formatted text selected across boundaries
 *      <span>ab[c</span> <b>de]fgh</b>
 *   output:
 *      <span>ab[c</span> de]<b>fgh</b>
 */

import { HTMLApplier } from "../selection/html_applier";
import dom from "../dom";

var ALIAS_MAPPING = {
  strong: "b",
  em: "i",
  b: "strong",
  i: "em"
};
var htmlApplier = {};

function _getTagNames(tagName) {
  var alias = ALIAS_MAPPING[tagName];
  return alias ? [tagName.toLowerCase(), alias.toLowerCase()] : [tagName.toLowerCase()];
}

function _getApplier(tagName, className, classRegExp, cssStyle, styleRegExp) {
  var identifier = tagName + ":" + className;
  if (cssStyle) {
    identifier += ":" + cssStyle
  }
  if (!htmlApplier[identifier]) {
    htmlApplier[identifier] = new HTMLApplier(_getTagNames(tagName), className, classRegExp, true, cssStyle, styleRegExp);
  }
  return htmlApplier[identifier];
}

var formatInline = {
  exec: function(composer, command, tagName, className, classRegExp, cssStyle, styleRegExp) {
    var range = composer.selection.createRange();
    var ownRanges = composer.selection.getOwnRanges();

    if (!ownRanges || ownRanges.length == 0) {
      return false;
    }
    composer.selection.getSelection().removeAllRanges();
    _getApplier(tagName, className, classRegExp, cssStyle, styleRegExp).toggleRange(ownRanges);

    range.setStart(ownRanges[0].startContainer,  ownRanges[0].startOffset);
    range.setEnd(
      ownRanges[ownRanges.length - 1].endContainer,
      ownRanges[ownRanges.length - 1].endOffset
    );

    composer.selection.setSelection(range);
  },

  state: function(composer, command, tagName, className, classRegExp, cssStyle, styleRegExp) {
    var aliasTagName = ALIAS_MAPPING[tagName] || tagName;

    // Check whether the document contains a node with the desired tagName
    if (!dom.hasElementWithTagName(composer.element, tagName) &&
        !dom.hasElementWithTagName(composer.element, aliasTagName)) {
      return false;
    }

     // Check whether the document contains a node with the desired className
    if (className && !dom.hasElementWithClassName(composer.element, className)) {
       return false;
    }

    var ownRanges = composer.selection.getOwnRanges();

    if (ownRanges.length == 0) {
      return false;
    }

    return _getApplier(tagName, className, classRegExp, cssStyle, styleRegExp).isAppliedToRange(ownRanges);
  }
};

export { formatInline };
