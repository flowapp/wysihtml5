/**
 * Force rerendering of a given element
 * Needed to fix display misbehaviors of IE
 *
 * @param {Element} element The element object which needs to be rerendered
 * @example
 *    wysihtml5.quirks.redraw(document.body);
 */

import { addClass, removeClass } from "../dom/class";

var CLASS_NAME = "wysihtml5-quirks-redraw";

var redraw = function(element) {
  addClass(element, CLASS_NAME);
  removeClass(element, CLASS_NAME);
  
  // Following hack is needed for firefox to make sure that image resize handles are properly removed
  try {
    var doc = element.ownerDocument;
    doc.execCommand("italic", false, null);
    doc.execCommand("italic", false, null);
  } catch(e) {}
};

export { redraw };