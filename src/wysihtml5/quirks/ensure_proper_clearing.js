/**
 * IE and Opera leave an empty paragraph in the contentEditable element after clearing it
 *
 * @param {Object} contentEditableElement The contentEditable element to observe for clearing events
 * @exaple
 *    wysihtml5.quirks.ensureProperClearing(myContentEditableElement);
 */
import dom from "../dom";

var ensureProperClearing = (function() {
  var clearIfNecessary = function() {
    var element = this;
    setTimeout(function() {
      var innerHTML = element.innerHTML.toLowerCase();
      if (innerHTML == "<p>&nbsp;</p>" ||
          innerHTML == "<p>&nbsp;</p><p>&nbsp;</p>" ||
          innerHTML == "<p><br></p>") {
        element.innerHTML = "";
      }
    }, 0);
  };

  return function(composer) {
    dom.observe(composer.element, ["blur"], clearIfNecessary);
  };
})();

export { ensureProperClearing };
