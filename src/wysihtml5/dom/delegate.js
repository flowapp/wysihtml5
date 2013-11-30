/**
 * Event Delegation
 *
 * @example
 *    wysihtml5.dom.delegate(document.body, "a", "click", function() {
 *      // foo
 *    });
 */
import { observe } from "./observe";
import lang from "wysihtml5/lang";

var delegate = function(container, selector, eventName, handler) {
  return observe(container, eventName, function(event) {
    var target = event.target,
        match = lang.array(container.querySelectorAll(selector));
    
    while (target && target !== container) {
      if (match.contains(target)) {
        handler.call(target, event);
        break;
      }
      target = target.parentNode;
    }
  });
};

export { delegate };