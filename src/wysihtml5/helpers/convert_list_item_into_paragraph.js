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
    var children = nodeList.toArray(list.childNodes);
    var index = children.indexOf(listItem);
    if (index !== -1) {
      var newList = document.createElement(list.nodeName);
      children = children.slice(index + 1);
      children.forEach(function(node) {
        newList.appendChild(node);
      });
      list.removeChild(listItem);
      var parent = list.parentNode;
      parent.insertBefore(newList, list.nextSibling);
      parent.insertBefore(paragraph, newList);
      if (!newList.childNodes.length) {
        parent.removeChild(newList);
      }
      composer.selection.setBefore(paragraph);
    }
  }
}

export { convertListItemIntoParagraph };
