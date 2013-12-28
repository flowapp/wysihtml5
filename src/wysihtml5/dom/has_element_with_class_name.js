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

var LIVE_CACHE = {};
var DOCUMENT_IDENTIFIER = 1;

function _getDocumentIdentifier(doc) {
  return doc._wysihtml5_identifier || (doc._wysihtml5_identifier = DOCUMENT_IDENTIFIER++);
}

var hasElementWithClassName = function(doc, className) {
  var key = _getDocumentIdentifier(doc) + ":" + className;
  var cacheEntry = LIVE_CACHE[key];
  if (!cacheEntry) {
    cacheEntry = LIVE_CACHE[key] = doc.getElementsByClassName(className);
  }

  return cacheEntry.length > 0;
};

export { hasElementWithClassName };
