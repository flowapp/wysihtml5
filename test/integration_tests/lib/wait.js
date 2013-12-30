var RSVP = require("rsvp");

module.exports = function(timeout) {
  return new RSVP.Promise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, timeout || 10);
  });
};
