import { Composer } from "./composer";

Composer.prototype._setupFakeSelectionEvents = function() {
  this._bindSelectionEvents = this._bindSelectionEvents.bind(this);
  this._unbindSelectionEvents = this._unbindSelectionEvents.bind(this);
  this._fireSelectionChange = this._fireSelectionChange.bind(this);
  this._documentMouseDown = this._documentMouseDown.bind(this);
  this._documentMouseUp = this._documentMouseUp.bind(this);
  this._documentSelectionChange = this._documentSelectionChange.bind(this);

  this.element.addEventListener("focus", this._bindSelectionEvents);
  this.element.addEventListener("blur", this._unbindSelectionEvents);
};

Composer.prototype._bindSelectionEvents = function() {
  if ("onselectionchange" in document) {
    document.addEventListener("mousedown", this._documentMouseDown);
    document.addEventListener("mouseup", this._documentMouseUp);
    document.addEventListener("selectionchange", this._documentSelectionChange);
  } else {
    document.addEventListener("mouseup", this._fireSelectionChange);
    this.element.addEventListener("keyup", this._fireSelectionChange);
    this.element.addEventListener("keydown", this._fireSelectionChange);
  }
  this._fireSelectionChange();
};

Composer.prototype._unbindSelectionEvents = function() {
  if ("onselectionchange" in document) {
    document.removeEventListener("mousedown", this._documentMouseDown);
    document.removeEventListener("mouseup", this._documentMouseUp);
    document.removeEventListener("selectionchange", this._documentSelectionChange);
  } else {
    document.removeEventListener("mouseup", this._fireSelectionChange);
    this.element.removeEventListener("keyup", this._fireSelectionChange);
    this.element.removeEventListener("keydown", this._fireSelectionChange);
  }
  this._fireSelectionChange();
};

Composer.prototype._fireSelectionChange = function() {
  var range = this.selection.getRange();
  var returnValue = null;
  if (range) {
    var nativeRange = range.nativeRange;
    var position = this.element.compareDocumentPosition(nativeRange.commonAncestorContainer);
    if (position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      returnValue = nativeRange;
    }
  }

  var event = document.createEvent("CustomEvent");
  event.initCustomEvent("wysihtml5:selectionchange", false, false, returnValue);
  this.element.dispatchEvent(event);

};


// Support for document.onselectionchange
Composer.prototype._documentMouseDown = function() {
  this._enabled = false;
};

Composer.prototype._documentMouseUp = function(e) {
  this._enabled = true;
  this._fireSelectionChange();
};

Composer.prototype._documentSelectionChange = function(e) {
  if (this._enabled) {
    this._fireSelectionChange();
  }
};
