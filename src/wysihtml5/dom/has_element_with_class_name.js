/**
 * High performant way to check whether an element with a specific class name is in the given document
 * Optimized for being heavily executed
 * Unleashes the power of live node lists
 *
 * @param {Object} doc The document object of the context where to check
 * @param {String} tagName Upper cased tag name
 * @example
 *    wysihtml5.dom.hasElementWithClassName(document, "foobar");
 */

import { elementIdentifier } from "../helpers/element_identifier";

var LIVE_CACHE = {};

var hasElementWithClassName = function(element, className) {
  var key = elementIdentifier(element) + ":" + className;
  var cacheEntry = LIVE_CACHE[key];
  if (!cacheEntry) {
    cacheEntry = LIVE_CACHE[key] = element.getElementsByClassName(className);
  }
  return cacheEntry.length > 0;
};

export { hasElementWithClassName };
