var wd = require("wd");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
require("mocha-as-promised")();

var DOM = require("../lib/dom_helper");
var SetupContentEditable = require("../lib/setup_content_editable");
var ContentShouldEqual = require("../lib/content");

chai.use(chaiAsPromised);

describe("Insert Ordered List", function() {
  var editor;
  var paragraph;

  context("single paragraph element", function() {
    beforeEach(function() {
      return SetupContentEditable("<p>Testing</p>").then(function(item) {
        editor = item;
        return item.elementByTagName("p");
      }).then(function(p) {
        paragraph = p;
      });
    });
    it("should insert ordered list", function() {
      return DOM.selectNodeContents(paragraph).then(function() {
        return DOM.exec("insertOrderedList");
      }).then(function() {
        return ContentShouldEqual(editor, "<ol><li>Testing</li></ol>");
      });
    });
  });

  context("multiple paragraph element", function() {
    beforeEach(function() {
      return SetupContentEditable("<p>Mail insurance check</p><p>Burn down banana stand</p>").then(function(item) {
        editor = item;
      });
    });
    it("should insert ordered list", function() {
      return DOM.selectNodeContents(editor).then(function() {
        return DOM.exec("insertOrderedList");
      }).then(function() {
        return ContentShouldEqual(editor, "<ol><li>Mail insurance check</li><li>Burn down banana stand</li></ol>");
      });
    });
  });
});
