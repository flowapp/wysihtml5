import { renameElement }  from "../dom/rename_element";
import { getParentElement }  from "../dom/get_parent_element";

var ensureParagraph = function(element, composer) {
  var blockElement = getParentElement(element, {
    nodeName: ["DIV", "P"]
  });

  if (blockElement && blockElement.nodeName !== "P") {
    if (blockElement === composer.element) {
      composer.selection.surround({nodeName: "P"});
    } else {
      renameElement(element, "p");
    }
  }
};

export { ensureParagraph };
