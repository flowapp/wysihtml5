var wd = require("wd");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
require("mocha-as-promised")();

var DOM = require("../lib/dom_helper");
var SetupContentEditable = require("../lib/setup_content_editable");
var ContentShouldEqual = require("../lib/content");

chai.use(chaiAsPromised);

describe("Auto Listing", function() {
  var editor;
  beforeEach(function() {
    return SetupContentEditable("<p></p>").then(function(item) {
      editor = item;
    });
  });
  var unorderedOptions = ["*", "-", "•"];

  context("unordered lists", function() {
    unorderedOptions.forEach(function(option) {
      it("should auto-list an unordered list by typing "+ option, function() {
        return editor.type(option +" test").then(function() {
          return ContentShouldEqual(editor, "<ul><li>test</li></ul>");
        });
      });

      it ("should not auto list inside a list-item, by typing "+ option, function() {
        return editor.type(option +" "+ option +" test").then(function() {
          return ContentShouldEqual(editor, "<ul><li>"+ option +" test</li></ul>");
        });
      });
    });
  });

  context("ordered lists", function() {
    it("Should auto-list an ordered list by typing `1.`", function() {
      return editor.type("1. test").then(function() {
        return ContentShouldEqual(editor, "<ol><li>test</li></ol>");
      });
    });

    it("should not auto list inside a list-item, by typing 1.", function() {
       return editor.type("1. 1. test").then(function() {
        return ContentShouldEqual(editor, "<ol><li>1. test</li></ol>");
      });
    });
  });

  ["*", "-", "•", "1."].forEach(function(option) {
    it("should only auto-list—by typing `"+ option +"`—if the committed word is at the beginning of its block element", function() {
      return editor.type("test "+ option +" test").then(function() {
        return ContentShouldEqual(editor, "<p>test "+ option +" test</p>");
      });
    });
  });
});
