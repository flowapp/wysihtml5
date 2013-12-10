var wd = require("wd");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
require("mocha-as-promised")();

var DOM = require("../lib/dom_helper");
var SetupContentEditable = require("../lib/setup_content_editable");
var ContentShouldEqual = require("../lib/content");

chai.use(chaiAsPromised);

describe("Text Substitutions", function() {
  var editor;
  context("committing words", function() {
    beforeEach(function() {
      return SetupContentEditable("").then(function(item) {
        editor = item;
        return browser.execute("\
          window.CommittedWords = [];\
          wysihtml5.Composer.RegisterTextSubstitution(function(content) { \
            window.CommittedWords.push(content);\
            return false;\
          }, \
          function() {},\
          {word: true, sentence: false});\
        ");
      });
    });

    [" ",  wd.SPECIAL_KEYS["Return"]].forEach(function(word) {
      it("should commit words by typing return", function() {
        return editor.type("banana"+ word +"stand"+ word).then(function() {
          return browser.execute("return window.CommittedWords;")
        }).then(function(words) {
          expect(words).to.deep.equal(["banana", "stand"]);
        });
      });
    });
  });
});
