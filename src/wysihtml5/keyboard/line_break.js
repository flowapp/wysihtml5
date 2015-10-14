import { Constants } from "../constants";
import { Composer } from "../views/composer";
import dom from "../dom";

/**
 * Emulate native browser behaviour of Shift-Enter inserting a <br> instead
 * of a new paragraph.
**/
Composer.RegisterKeyboardHandler(function(e) {
  return (
      e.type === "keydown" &&
      e.keyCode == Constants.ENTER_KEY &&
      e.shiftKey
  );
}, function(editor, composer, e) {
    var breakElement = document.createElement("br"),
        selectedNode = composer.selection.getSelectedNode();
    e.preventDefault();

    if (selectedNode.nodeName === "P") {
      selectedNode.appendChild(breakElement);
    } else if (selectedNode.nodeName === "BR") {
      dom.insert(breakElement).after(selectedNode);
    } else {
      var initialBreakElement = document.createElement("br");
      dom.insert(initialBreakElement).after(selectedNode);
      dom.insert(breakElement).after(initialBreakElement);
    }

    composer.selection.setAfter(breakElement);
});
