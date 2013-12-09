var reblock = function(blockElement, listElement) {
  var firstChild = blockElement.firstChild;
  var parentNode = blockElement.parentNode;

  if (firstChild != listElement) {
    var range = document.createRange();
    range.setStartBefore(firstChild);
    range.setEndBefore(listElement);
    var documentFragment = range.extractContents();
    var paragraph = document.createElement("P");
    paragraph.appendChild(documentFragment);
    blockElement.parentNode.insertBefore(paragraph, blockElement);
  }

  blockElement.parentNode.insertBefore(listElement, blockElement);

  if (!blockElement.textContent) {
    parentNode.removeChild(blockElement);
  }
};

export { reblock };
