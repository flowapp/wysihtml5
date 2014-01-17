import { renameElement }  from "../dom/rename_element";

var ensureParagraph = function(element, composer) {
  var blockElement = composer.parentElement(element, {
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
