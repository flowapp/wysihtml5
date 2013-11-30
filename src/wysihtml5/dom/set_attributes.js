var mapping = {
  "className": "class"
};
var setAttributes = function(attributes) {
  return {
    on: function(element) {
      for (var i in attributes) {
        element.setAttribute(mapping[i] || i, attributes[i]);
      }
    }
  };
};

export { setAttributes };