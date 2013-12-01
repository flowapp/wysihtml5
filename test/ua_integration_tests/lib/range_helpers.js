function SetRangeToEndOfElement(node) {
  var range = document.createRange();
  range.selectNodeContents(node);
  range.collapse();
  SelectRange(range);
  return range;
}

function SelectRange(range) {
  var selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

export { SetRangeToEndOfElement };