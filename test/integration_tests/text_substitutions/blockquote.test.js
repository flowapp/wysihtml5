var wd = require("wd");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
require("mocha-as-promised")();

var DOM = require("../lib/dom_helper");
var SetupContentEditable = require("../lib/setup_content_editable");
var ContentShouldEqual = require("../lib/content");

chai.use(chaiAsPromised);

describe("Blackquote", function() {
  var editor;
  beforeEach(function() {
    return SetupContentEditable("").then(function(item) {
      editor = item;
    });
  });

  it("creating blackquote by committing `>`", function() {
    return editor.type("> test").then(function() {
      return ContentShouldEqual(editor, "<blockquote>test<br></blockquote>");
    });
  });

  it("only create blackquote by committing `>` at the start of the paragraph", function() {
    return editor.type("test > test").then(function() {
      return ContentShouldEqual(editor, "<p>test &gt; test<br></p>");
    });
  });
});
