/**
 * Returns the given html wrapped in a div element
 *
 * @param {String} html The html which should be wrapped in a dom element
 * @param {Obejct} [context] Document object of the context the html belongs to
 *
 * @example
 *    wysihtml5.dom.getAsDom("<article>foo</article>");
 */

import { browser } from "../browser";

var getAsDom = (function() {
  return function(html, context) {
    context = context || document;
    var tempElement;
    if (typeof(html) === "object" && html.nodeType) {
      tempElement = context.createElement("div");
      tempElement.appendChild(html);
    } else {
      tempElement = context.createElement("div");
      tempElement.innerHTML = html;
    }
    return tempElement;
  };
})();
export { getAsDom };
