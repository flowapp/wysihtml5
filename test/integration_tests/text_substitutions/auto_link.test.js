var wd = require("wd");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
require("mocha-as-promised")();

var DOM = require("../lib/dom_helper");
var SetupContentEditable = require("../lib/setup_content_editable");
var ContentShouldEqual = require("../lib/content");

chai.use(chaiAsPromised);

var hrefForItem = function() {
  return browser.elementByTagName("A").then(function(link) {
    return link.getAttribute("href");
  });
};


describe("Auto linking", function() {
  var editor;
  beforeEach(function() {
    return SetupContentEditable("").then(function(item) {
      editor = item;
    });
  });

  it("should auto link URLs starting with `http://`", function() {
    return editor.type("http://getflow.com/ ").then(function() {
      return expect(hrefForItem()).to.eventually.equal("http://getflow.com/")
    });
  });

  it("should auto link URLs starting with `https://`", function() {
    return editor.type("https://getflow.com ").then(function() {
      return expect(hrefForItem()).to.eventually.equal("https://getflow.com/")
    });
  });

  it("should auto link URLs starting with `www`", function() {
    return editor.type("www.getflow.com ").then(function() {
      return expect(hrefForItem()).to.eventually.equal("http://www.getflow.com")
    });
  });

  it("should auto link URLs starting with a protocol", function() {
    return editor.type("mailto:michael@bluth.com").then(function() {
      return expect(hrefForItem()).to.eventually.equal("http://www.getflow.com")
    });
  });
});
