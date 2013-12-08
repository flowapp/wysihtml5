var wd = require("wd");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
require("mocha-as-promised")();

var DOM = require("../lib/dom_helper");
var SetupContentEditable = require("../lib/setup_content_editable");
var ContentShouldEqual = require("../lib/content");

chai.use(chaiAsPromised);


describe("Prevent empty inherence", function() {
  var editor;
  var paragraph;
  beforeEach(function() {
    return SetupContentEditable("<h2><br></h2><p>Banana Stand</p>").then(function(item) {
      editor = item;
      return editor.elementByTagName("P");
    }).then(function(p) {
      paragraph = p;
    });
  });

  it("should not inherit styles when the previousSibling is empty", function(done) {
    return DOM.selectStartOfNode(paragraph).then(function(done) {
      return editor.type(wd.SPECIAL_KEYS["Back space"]);
    }).then(function() {
      return ContentShouldEqual(editor, "<p>Banana Stand</p>");
    });
  });
});
