var insertParagraphAfter = function(after) {
  var paragraph = document.createElement("p");
  var breakElement = document.createElement("br");
  paragraph.appendChild(breakElement);
  after.parentNode.insertBefore(paragraph, after.nextSibling);
  return breakElement;
};

export { insertParagraphAfter };
