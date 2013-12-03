import { Constants } from "../constants";
import { Composer } from "../views/composer";
import dom from "../dom";
import { redraw } from "../quirks/redraw";

// TODO link to failing test

Composer.RegisterKeyboardHandler(function(e) {
  return (
    e.type === "keydown" &&
    (e.keyCode === Constants.BACKSPACE_KEY || e.keyCode === Constants.DELETE_KEY)
  );
}, function(editor, composer, e) {
  var target = composer.selection.getSelectedNode();
  if (target.nodeName === "IMG") {
    var parent = target.parentNode;
    // delete the <img>
    parent.removeChild(target);
    // and it's parent <a> too if it hasn't got any other child nodes
    if (parent.nodeName === "A" && !parent.firstChild) {
      parent.parentNode.removeChild(parent);
    }
    setTimeout(function() { redraw(element); }, 0);
    event.preventDefault();
  }
});
