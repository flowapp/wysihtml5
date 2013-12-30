var jsdom = require("jsdom");
var RSVP = require("rsvp");
var chai = require("chai");
var expect = chai.expect;

var Assertion = chai.Assertion;
var assert = chai.assert;

Assertion.addMethod("equalNode", function (b) {
  var _this = this;
  var a = this._obj;

  this.assert(a.isEqualNode(b),
              "expected node to equal #{exp} but it was #{act}",
              "expected node to not equal #{exp} but it was",
              b.innerHTML,
              a.innerHTML);
});

var approximatelyEqualsHTMLString = function(a, b) {
  return RSVP.all([normalize(a), normalize(b)]).then(function(windows) {
    expect(windows[0].document.body).to.be.equalNode(windows[1].document.body)
  });
};

var normalize = function(html) {
  return setupDOM(html).then(function(window) {
    var body = window.document.body;
    body.normalize();
    cleanupChildNodes(body);
    removeSingleEmptyBreakLine(body);
    return window;
  });
};

var removeSingleEmptyBreakLine = function(node) {
  var children = node.childNodes;
  for (var index = children.length - 1; index >= 0; index--) {
    var childNode = children[index];
    switch (childNode.nodeType) {
      case childNode.TEXT_NODE:
        childNode.nodeValue = childNode.nodeValue.replace(/\uFEFF/, "");
        break;
      case childNode.ELEMENT_NODE:
        if (childNode.nodeName == "BR") {
          if (node.lastChild == childNode && childNode.previousSibling && childNode.previousSibling.nodeName != "BR") {
            node.removeChild(childNode);
          }
        } else {
          removeSingleEmptyBreakLine(childNode);
        }
        break;
    }
  };
};

var cleanupChildNodes = function(node) {
  var children = node.childNodes
  for (var index = children.length - 1; index >= 0; index--) {
    var childNode = children[index];
    switch (childNode.nodeType) {
      case childNode.TEXT_NODE:
        if (!childNode.nodeValue) {
          node.removeChild(childNode);
        }
        break;
      case childNode.ELEMENT_NODE:
        cleanupChildNodes(childNode);
        break;
      case childNode.COMMENT_NODE:
        node.removeChild(childNode);
        break;
    }
  };
};

var setupDOM = function(html) {
  return new RSVP.Promise(function(resolve, revoke) {
    jsdom.env(
      html,
      [],
      function (errors, window) {
        if (errors) {
          revoke(errors);
        } else {
          resolve(window);
        }
      }
    );
  });
};

module.exports = approximatelyEqualsHTMLString;
