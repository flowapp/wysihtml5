// determine if we can use `splitText`
var splitUpTextNodeAtCursor = function(range) {
  var startContainer = range.startContainer;
  if (range.collapsed && startContainer.nodeType === Node.TEXT_NODE) {
    var content = startContainer.textContent;
    var before = content.slice(0, range.startOffset);
    var after = content.slice(range.startOffset, content.length);
    if (after) {
      var newNode = document.createTextNode(after)
      startContainer.textContent = before;
      startContainer.parentNode.insertBefore(newNode, startContainer.nextSibling);
      return newNode;
    }
  }
};

export { splitUpTextNodeAtCursor };
