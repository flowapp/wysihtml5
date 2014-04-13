/**
 * Method to set dom events
 *
 * @example
 *    wysihtml5.dom.observe(iframe.contentWindow.document.body, ["focus", "blur"], function() { ... });
 */
var observe = function(element, eventNames, handler) {
  eventNames = typeof(eventNames) === "string" ? [eventNames] : eventNames;

  var length = eventNames.length;
  for (var index = 0; index < length; index++) {
    element.addEventListener(eventNames[index], handler, false);
  }

  return {
    stop: function() {
      var length = eventNames.length;
      for (var index = 0; index < length; index++) {
        element.removeEventListener(eventNames[index], handler, false);
      }
    }
  };
};

export { observe };
