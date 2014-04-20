import { appendChildNodes } from "../dom/append_child_nodes";
import { nodeList } from "../dom/node_list";

var convertNestedBlockquoteIntoParagraph = function(paragraph) {
  var blockquote = paragraph.parentNode; // Switch to using getParentElement
  if (blockquote.firstElementChild === paragraph) {
    var parent = blockquote.parentNode;
    parent.insertBefore(paragraph, blockquote);
    if (!blockquote.firstChild) { // TODO
      parent.removeChild(blockquote);
    }
  } else {
    var children = nodeList.toArray(blockquote.childNodes);
    var index = children.indexOf(paragraph);
    if (index !== -1) {
      var newBlockquote = document.createElement("blockquote");
      children = children.slice(index + 1);
      children.forEach(function(node) {
        newBlockquote.appendChild(node);
      });
      var parent = blockquote.parentNode;
      parent.insertBefore(newBlockquote, blockquote.nextSibling);
      parent.insertBefore(paragraph, newBlockquote);
      if (!newBlockquote.firstChild) {
        parent.removeChild(newBlockquote);
      }
    }
  }
  return paragraph;
}

export { convertNestedBlockquoteIntoParagraph };
