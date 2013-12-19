var isPrintableKey = function(keyCode) {
  return (keyCode > 47 && keyCode < 58) || // number keys
  keyCode == 32 || keyCode == 13 || // spacebar & return key
  (keyCode > 64 && keyCode < 91) || // letter keys
  (keyCode > 95 && keyCode < 112) || // numpad keys
  (keyCode > 185 && keyCode < 193) || // ;=,-./`
  (keyCode > 218 && keyCode < 223);   // [\]'
};

export { isPrintableKey };
