var wd = require("wd");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
require("mocha-as-promised")();
chai.use(chaiAsPromised);

var DOM = require("../lib/dom_helper");
var SetupContentEditable = require("../lib/setup_content_editable");
var ContentShouldEqual = require("../lib/content");

describe("Delete block elements", function() {
  [{
    tagName: "pre",
    context: "preformatted text"
  }, {
    tagName: "blockquote",
    context: "blockquote"
  }].forEach(function(item) {
    context(item.context, function() {
      it("should convert "+ item.context +" element to a paragraph element", function() {
        var editor;
        return SetupContentEditable("<"+ item.tagName +">[]Banana stand</"+ item.tagName +">").then(function(e) {
          editor = e;
          return editor.type(wd.SPECIAL_KEYS["Back space"]);
        }).then(function() {
          return ContentShouldEqual(editor, "<p>Banana stand</p>");
        });
      });
    });
  });

  [{
    tagName: "ul",
    context: "unordered list"
  }, {
    tagName: "ol",
    context: "ordered list"
  }].forEach(function(item) {
    context("list item in a "+ item.context, function() {
      context("only child", function() {
        it("should convert list item into a paragraph", function() {
          var editor;
          var content = "<ul><li>[]Banana stand</li></ul>";
          return SetupContentEditable(content).then(function(e) {
            editor = e;
            return editor.type(wd.SPECIAL_KEYS["Back space"]);
          }).then(function() {
            return ContentShouldEqual(editor, "<p>Banana stand</p>");
          });
        });
      });

      context("first child", function() {
        it("should convert list item into a paragraph", function() {
          var editor;
          var content = "<"+ item.tagName +"><li>[]Burn down banana stand</li><li>Mail insurance check</li></"+ item.tagName +">";
          return SetupContentEditable(content).then(function(e) {
            editor = e;
            return editor.type(wd.SPECIAL_KEYS["Back space"]).then(function() {
          })
            return ContentShouldEqual(editor, "<p>Burn down banana stand</p><"+ item.tagName +"><li>Mail insurance check</li></"+ item.tagName +">");
          });
        });
      });

      context("last child", function() {
        it("should convert list item into a paragraph", function() {
          var editor;
          var content = "<"+ item.tagName +"><li>Burn down banana stand</li><li>[]Mail insurance check</li></"+ item.tagName +">";
          return SetupContentEditable(content).then(function(e) {
            editor = e;
            return editor.type(wd.SPECIAL_KEYS["Back space"]);
          }).then(function() {
            return ContentShouldEqual(editor, "<"+ item.tagName +"><li>Burn down banana stand</li></"+ item.tagName +"><p>Mail insurance check</p>");
          });
        });
      });

      context("middle child", function() {
        it("should convert list item into a paragraph", function() {
          var editor;
          var content = "<"+ item.tagName +"><li>Burn down banana stand</li><li>[]Mail insurance check</li><li>Something</li></"+ item.tagName +">";
          return SetupContentEditable(content).then(function(e) {
            editor = e;
            return editor.type(wd.SPECIAL_KEYS["Back space"]);
          }).then(function() {
            var content = "<"+ item.tagName +"><li>Burn down banana stand</li></"+ item.tagName +"><p>Mail insurance check</p><"+ item.tagName +"><li>Something</li></"+ item.tagName +">";
            return ContentShouldEqual(editor, content);
          });
        });
      });
    });
  });
});
