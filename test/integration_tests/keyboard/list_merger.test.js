var wd = require("wd");
var expect = require("chai").expect;
var DOM = require("../lib/dom_helper");
var SetupContentEditable = require("../lib/setup_content_editable");
var ContentShouldEqual = require("../lib/content");
var RSVP = require("rsvp");
var wait = require("./lib/wait");

describe("List Merger", function() {
  context("collapsed range", function() {
    [{
      tagName: "ol",
      context: "ordered lists"
    }, {
      tagName: "ul",
      context: "unordered lists"
    }].forEach(function(item) {
      context(item.context, function() {
        var editor;
        var paragraph;
        var tag = item.tagName;
        beforeEach(function() {
          return SetupContentEditable("<"+ tag +"><li>Hey</li></"+ tag +"><p>Content</p><"+ tag +"><li>More</li></"+ tag +">").then(function(item) {
            editor = item;
            return editor.elementByTagName("P");
          }).then(function(p) {
            paragraph = p;
          });
        });

        it("should merge the lists by pressing backspace in the paragraph", function(done) {
          return DOM.selectStartOfNode(paragraph).then(function(done) {
            return editor.type(wd.SPECIAL_KEYS["Back space"]);
          }).then(function() {
            return ContentShouldEqual(editor, "<"+ tag +"><li>HeyContent</li><li>More</li></"+ tag +">");
          });
        });
      });
    });
  });
  context("uncollapsed range", function() {
    [{
      tagName: "ol",
      context: "Ordered Lists"
    }, {
      tagName: "ul",
      context: "Unordered Lists"
    }].forEach(function(item) {
      context(item.context, function() {
        var editor;
        var paragraph;
        var tag = item.tagName
        beforeEach(function() {
          return SetupContentEditable("<"+ tag +"><li>He[y</li></"+ tag +"><p>Conte]nt</p><"+ tag +"><li>More</li></"+ tag +">").then(function(item) {
            editor = item;
          });
        });

        it("collapsing with backspace", function() {
          return editor.type(wd.SPECIAL_KEYS["Back space"]).then(function() {
            return wait();
          }).then(function() {
            return ContentShouldEqual(editor, "<"+ tag +"><li>Hent</li><li>More</li></"+ tag +">");
          });
        });

        it("collapsing with delete", function() {
          return editor.type(wd.SPECIAL_KEYS["Delete"]).then(function() {
            return wait();
          }).then(function() {
            return ContentShouldEqual(editor, "<"+ tag +"><li>Hent</li><li>More</li></"+ tag +">");
          });
        });

        it("collapsing with letter", function() {
          return editor.type("i").then(function() {
            return wait();
          }).then(function() {
            return ContentShouldEqual(editor, "<"+ tag +"><li>Heint</li><li>More</li></"+ tag +">");
          });
        });
      });
    });
  });
});
