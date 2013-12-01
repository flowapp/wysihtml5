import { ContentEditableDiv } from "../lib/content_editable";
import { SetRangeToEndOfElement } from "../lib/range_helpers";
import { Keyboard } from "../lib/keyboard_helper";

var HEADERS = ["h1", "h2", "h3", "h4", "h5", "h6"];
var ENTER_KEY = 13;

beforeEach(function() {
  this.element = ContentEditableDiv();
});

afterEach(function() {
  document.body.removeChild(this.element);
});

describe("headers", function() {
  HEADERS.forEach(function(header) {
    it("should insert a paragraph when hitting return inside a "+ header, function() {
      this.keyboard = new Keyboard(ENTER_KEY, this.element);
      this.element.innerHTML = "<"+ header +">HEADER</"+ header +">";
      this.range = SetRangeToEndOfElement(this.element.querySelector(header));
      this.keyboard.trigger();

      var keyboard = new Keyboard(68);
      keyboard.trigger();

      console.log("LOL: ", this.element.innerHTML);
    });
  });
});