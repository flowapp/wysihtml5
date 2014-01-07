var insertParagraphAfter = function(after, composer) {
  var paragraph = document.createElement("p");
  var breakElement = document.createElement("br");
  paragraph.appendChild(breakElement);
  after.parentNode.insertBefore(paragraph, after.nextSibling);
  composer.selection.setBefore(breakElement);
};

export { insertParagraphAfter };
