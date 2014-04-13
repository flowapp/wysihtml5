var DOCUMENT_IDENTIFIER = 1;

var elementIdentifier = function(element) {
  return element._wysihtml5_identifier || (element._wysihtml5_identifier = DOCUMENT_IDENTIFIER++);
};

export { elementIdentifier };
