/**
 * High performant way to check whether an element with a specific tag name is in the given document
 * Optimized for being heavily executed
 * Unleashes the power of live node lists
 *
 * @param {Object} doc The document object of the context where to check
 * @param {String} tagName Upper cased tag name
 * @example
 *    wysihtml5.dom.hasElementWithTagName(document, "IMG");
 */

import { elementIdentifier } from "../helpers/element_identifier";

var LIVE_CACHE = {};

var hasElementWithTagName = function(element, tagName) {
  var key = elementIdentifier(element) + ":" + tagName;
  var cacheEntry = LIVE_CACHE[key];
  if (!cacheEntry) {
    cacheEntry = LIVE_CACHE[key] = element.getElementsByTagName(tagName);
  }

  return cacheEntry.length > 0;
};

export { hasElementWithTagName };
