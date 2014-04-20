import { appendChildNodes } from "../dom/append_child_nodes";
import { nodeList } from "../dom/node_list";

/**
  Converts a set of lists items into paragraphs and resolves the list to fit
  around it. Assumes the set is sorted.

  @method convertListItemsIntoParagraphs
  @static
  @param {Array} listItems
  @return {Array} pragraphs
*/

var convertListItemsIntoParagraphs = function(listItems) {
  var list = listItems[0].parentNode;
  //
  var paragraphs = listItems.reverse().map(function(listItem) {
    var paragraph = document.createElement("p");
    appendChildNodes(listItem, paragraph);

    if (list.firstElementChild === listItem) {
      var parent = list.parentNode;
      parent.insertBefore(paragraph, list);
      if (list.lastElementChild == listItem) {
        parent.removeChild(list);
      } else {
        list.removeChild(listItem);
      }
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
        var nextSibling = list.nextSibling;
        parent.insertBefore(paragraph, nextSibling);
        if (newList.childNodes.length) {
          parent.insertBefore(newList, nextSibling);
        }
      }
    }
    return paragraph;
  });
  return paragraphs.reverse();
}

export default = convertListItemsIntoParagraphs;
