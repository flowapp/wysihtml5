import { reblock } from "../dom/reblock";

var listCleanup = function(composer) {
  var selectedNode = composer.selection.getSelectedNode();
  var blockElement = composer.parentElement(selectedNode, { nodeName: "P" });
  var listElement = composer.parentElement(selectedNode, { nodeName: ["OL", "UL", "MENU"] });
  if (blockElement && listElement) {
    reblock(blockElement, listElement);
    composer.selection.setAfter(listElement.querySelector("li"));
  }
};

export { listCleanup };
