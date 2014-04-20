var jsdom = require("jsdom");
var RSVP = require("rsvp");
var chai = require("chai");
var expect = chai.expect;

var Assertion = chai.Assertion;
var assert = chai.assert;

Assertion.addMethod("equalNode", function (b) {
  var a = this._obj;

  this.assert(a.isEqualNode(b),
              "expected node to equal #{exp} but it was #{act}",
              "expected node to not equal #{exp} but it was #{act}",
              b.innerHTML,
              a.innerHTML);
});

var approximatelyEqualsHTMLString = function(a, b, debug) {
  return RSVP.all([normalize(a), normalize(b)]).then(function(windows) {
    if (debug) {
      console.log("A: ", windows[0].document.body.innerHTML);
      console.log("B: ", windows[1].document.body.innerHTML);
    }
    expect(windows[0].document.body).to.be.equalNode(windows[1].document.body)
  });
};

var normalize = function(html) {
  return setupDOM(html).then(function(window) {
    var body = window.document.body;
    body.normalize();
    cleanupChildNodes(body, window);
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

var blockElements = Object.freeze([
  "ADDRESS",
  "ARTICLE",
  "ASIDE",
  "AUDIO",
  "BLOCKQUOTE",
  "CANVAS",
  "DD",
  "DIV",
  "DL",
  "FIELDSET",
  "FIGCAPTION",
  "FIGURE",
  "FOOTER",
  "FORM",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "HEADER",
  "HGROUP",
  "HR",
  "NOSCRIPT",
  "OL",
  "OUTPUT",
  "P",
  "PRE",
  "SECTION",
  "TABLE",
  "TFOOT",
  "UL",
  "VIDEO",
  "LI"
]);

var isBlockElement = function(node) {
  return (blockElements.indexOf(node.nodeName) !== -1)
}

var cleanupChildNodes = function(node, window) {
  var children = node.childNodes;
  for (var index = children.length - 1; index >= 0; index--) {
    var childNode = children[index];
    switch (childNode.nodeType) {
      case childNode.TEXT_NODE:
        if (!childNode.nodeValue) {
          node.removeChild(childNode);
        }

        // Trim leading whitespace if the parent is a block element
        if (index === 0 && isBlockElement(node) && node.nodeName !== "PRE") {
          var trimmed = childNode.textContent.trimLeft();
          if (trimmed) {
            childNode.textContent = trimmed;
          } else {
            node.removeChild(childNode);
          }
          break;
        }

        // Trim whitespace if next sibling is a block element
        var nextSibling = childNode.nextSibling;
        if (nextSibling && isBlockElement(nextSibling) && node.nodeName !== "PRE") {
          var trimmed = childNode.textContent.trimRight();
          if (trimmed) {
            childNode.textContent = trimmed;
          } else {
            node.removeChild(childNode);
          }
          break;
        }

        if (!nextSibling && isBlockElement(node) && node.nodeName !== "PRE") {
          var trimmed = childNode.textContent.trimRight();
          if (trimmed) {
            childNode.textContent = trimmed;
          } else {
            node.removeChild(childNode);
          }
          break;
        }

        break;
      case childNode.ELEMENT_NODE:
        cleanupChildNodes(childNode, window);
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
