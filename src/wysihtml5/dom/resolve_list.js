var LIST_NODE_NAME_MATCHER = /^(MENU|UL|OL)$/

var resolveList = function(list) {
  if (!list.nodeName.match(LIST_NODE_NAME_MATCHER)) {
    return;
  }

  var fragment = doc.createDocumentFragment();
  var firstChild, listItem;

  while (listItem = (list.firstElementChild || list.firstChild)) {
    if (listItem.querySelector("div, p, ul, ol, menu, blockquote, h1, h2, h3, h4, h5, h6")) {
      while (firstChild = listItem.firstChild) {
        fragment.appendChild(firstChild);
      }
    } else {
      var paragraph = document.createElement("p");
      while (firstChild = listItem.firstChild) {
        paragraph.appendChild(firstChild);
      }
      fragment.appendChild(paragraph);
    }
    listItem.parentNode.removeChild(listItem);
  }

  list.parentNode.replaceChild(fragment, list);
};

export { resolveList };
