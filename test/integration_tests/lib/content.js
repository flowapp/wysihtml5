var chai = require("chai");
var Assertion = chai.Assertion;
var approximatelyEqualsHTMLString = require("../lib/approximately_equals_html_string");

function ContentShouldEqual(item, shouldEqual, debug) {
  return browser.execute("return arguments[0].innerHTML;", [item]).then(function(content) {
    if (debug) {
      console.log("Content: ", content);
    }
    return approximatelyEqualsHTMLString(content, shouldEqual, debug);
  });
};

module.exports = ContentShouldEqual;
