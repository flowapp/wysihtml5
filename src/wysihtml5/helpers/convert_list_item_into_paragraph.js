import { appendChildNodes } from "../dom/append_child_nodes";
import { nodeList } from "../dom/node_list";

var convertListItemIntoParagraph = function(listItem, composer) {
  var list = listItem.parentNode;
  var paragraph = document.createElement("p");
  appendChildNodes(listItem, paragraph);
  if (list.firstElementChild === listItem) {
    var parent = list.parentNode;
    parent.insertBefore(paragraph, list);
    if (list.lastElementChild == listItem) {
      parent.removeChild(list);
    } else {
      list.removeChild(listItem);
    }
    composer.selection.setBefore(paragraph);
  } else {
    var newList = document.createElement(list.nodeName);
    var children = nodeList.toArray(list.childNodes);
    var index = children.indexOf(listItem);
    if (index !== -1) {
      children = children.slice(index + 1);
      children.forEach(function(node) {
        newList.appendChild(node);
      });
      list.removeChild(listItem);
      list.parentNode.insertBefore(newList, list.nextSibling);
      list.parentNode.insertBefore(paragraph, newList);
      composer.selection.setBefore(paragraph);
    }
  }
}

export { convertListItemIntoParagraph };
