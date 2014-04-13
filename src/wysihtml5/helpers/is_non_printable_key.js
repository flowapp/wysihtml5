var isNonPrintableKey = function(keyCode) {
  var modifierKeys = [8, 9, 13, 16, 17, 18, 19, 20, 27, 33, 34, 35, 26, 46, 93];
  var arrowKeys = [37, 38, 39, 40, 91, 92];
  var fKeys = [112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 144, 145];

  var nonPrintableKeys = modifierKeys.concat(arrowKeys).concat(fKeys);

  return nonPrintableKeys.indexOf(keyCode) != -1
};

export { isNonPrintableKey };
