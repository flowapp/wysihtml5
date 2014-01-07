var NEWLINE_SPLITTER = /\n\n+/;
var NEWLINE = /\n/g;

var fromPlainText = function(data, trustedContent) {
  var paragraphs = data.split(NEWLINE_SPLITTER);
  var incluedsTrailingNewLines = !paragraphs[paragraphs.length - 1];
  if (incluedsTrailingNewLines) {
    paragraphs.pop();
  }
  var fragment = paragraphs.map(function(chunk, index) {
    var paragraph = document.createElement("P");
    if (trustedContent) {
      chunk = chunk.replace(NEWLINE, "<br>");
      paragraph.innerHTML = chunk;
    } else {
      paragraph.textContent = chunk;
    }
    return paragraph;
  });
  return fragment;
};

export { fromPlainText };
