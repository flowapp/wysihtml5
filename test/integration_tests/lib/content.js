var chai = require("chai");
var Assertion = chai.Assertion;

function ContentShouldEqual(item, shouldEqual) {
  return browser.execute("return arguments[0].innerHTML;", [item]).then(function(content) {
    new Assertion(content).to.equal(shouldEqual);
  });
};

module.exports = ContentShouldEqual;
