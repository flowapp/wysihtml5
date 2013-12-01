function Keyboard(keyCode, element) {
  this.keyCode = keyCode;
  this.element = element;
}

Keyboard.prototype.trigger = function() {
  this.triggerKeyDown();
  this.triggerKeyPress();
  this.triggerKeyUp();
};

Keyboard.prototype.triggerKeyUp = function() {
  this._dispatchEventWithName("keyup");
};

Keyboard.prototype.triggerKeyPress = function() {
  this._dispatchEventWithName("keypress");
};

Keyboard.prototype.triggerKeyDown = function() {
  this._dispatchEventWithName("keydown");
};

Keyboard.prototype._dispatchEventWithName = function(name) {
  var event = document.createEvent("KeyboardEvent");
  var method = event.initKeyEvent || event.initKeyboardEvent;
  method.call(event, name, true, true, this.element., false, false, false, false, this.keyCode, 0);

  var canceled = !document.body.dispatchEvent(event);
  
  return event;
};

export { Keyboard };