import dom from "../dom";
import lang from "wysihtml5/lang";
import quirks from "../quirks";
import { browser } from "../browser";
import { Constants } from "../constants";
import { View } from "./view";
import { Selection } from "../selection/selection";
import { Commands} from "../commands";
import { UndoManager } from "../undo_manager";

var Composer = View.extend({
  name: "composer",
  browser: browser,
  dom: dom,

  // Needed for firefox in order to display a proper caret in an empty contentEditable
  CARET_HACK: "<br>",

  _keyboardHandlers: [],
  _textSubstitutions: [],

  constructor: function(parent, editableElement, config) {
    this.base(parent, editableElement, config);
    this.editableArea = editableElement;
    this._initContentEditableArea();
  },

  clear: function() {
    this.element.innerHTML = browser.displaysCaretInEmptyContentEditableCorrectly() ? "" : this.CARET_HACK;
  },

  getValue: function(parse) {
    var value = this.isEmpty() ? "" : quirks.getCorrectInnerHTML(this.element);
    
    if (parse) {
      value = this.parent.parse(value);
    }

    return value;
  },

  setValue: function(html, parse) {
    if (parse) {
      html = this.parent.parse(html);
    }
    
    try {
      this.element.innerHTML = html;
    } catch (e) {
      this.element.innerText = html;
    }
  },
  
  cleanUp: function() {
      this.parent.parse(this.element);
  },

  show: function() {
    this.editableArea.style.display = this._displayStyle || "";
  },

  hide: function() {
    this._displayStyle = dom.getStyle("display").from(this.editableArea);
    if (this._displayStyle === "none") {
      this._displayStyle = null;
    }
    this.editableArea.style.display = "none";
  },

  disable: function() {
    this.parent.fire("disable:composer");
    this.element.removeAttribute("contentEditable");
  },

  enable: function() {
    this.parent.fire("enable:composer");
    this.element.setAttribute("contentEditable", "true");
  },

  focus: function(setToEnd) {
    // IE 8 fires the focus event after .focus()
    // This is needed by our simulate_placeholder.js to work
    // therefore we clear it ourselves this time
    if (browser.doesAsyncFocus() && this.hasPlaceholderSet()) {
      this.clear();
    }
    
    this.base();
    
    var lastChild = this.element.lastChild;
    if (setToEnd && lastChild && this.selection) {
      if (lastChild.nodeName === "BR") {
        this.selection.setBefore(this.element.lastChild);
      } else {
        this.selection.setAfter(this.element.lastChild);
      }
    }
  },

  getTextContent: function() {
    return dom.getTextContent(this.element);
  },

  hasPlaceholderSet: function() {
    return this.getTextContent() == (this.editableArea.getAttribute("data-placeholder")) && this.placeholderSet;
  },

  isEmpty: function() {
    var innerHTML = this.element.innerHTML.toLowerCase();
    return innerHTML === ""            ||
           innerHTML === "<br>"        ||
           innerHTML === "<p></p>"     ||
           innerHTML === "<p><br></p>" ||
           this.hasPlaceholderSet();
  },
  
  _initContentEditableArea: function() {
    var that = this;
    
    this.sandbox = new dom.ContenteditableArea(function() {
        that._create();
    }, {}, this.editableArea);
  },
  
  _create: function() {
    var that = this;
    this.doc = this.sandbox.getDocument();
    this.element = this.sandbox.getContentEditable()
    this.cleanUp(); // cleans contenteditable on initiation as it may contain html
    
    // Make sure our selection handler is ready
    this.selection = new Selection(this.parent, this.element, this.config.uneditableContainerClassname);
    
    // Make sure commands dispatcher is ready
    this.commands  = new Commands(this.parent);

    dom.addClass(this.element, this.config.composerClassName);

    this.observe();
    
    var name = this.config.name;
    if (name) {
      dom.addClass(this.element, name);
    }
    
    this.enable();

    // Simulate html5 placeholder attribute on contentEditable element
    var placeholderText = typeof(this.config.placeholder) === "string"
      ? this.config.placeholder
      : ((this.config.noTextarea) ? this.editableArea.getAttribute("data-placeholder") : this.textarea.element.getAttribute("placeholder"));
    if (placeholderText) {
      dom.simulatePlaceholder(this.parent, this, placeholderText);
    }

    // Make sure that the browser avoids using inline styles whenever possible
    this.commands.exec("styleWithCSS", false);
    this.commands.exec("enableObjectResizing", false);
    this.commands.exec("insertBrOnReturn", false);
    
    //this._initUndoManager();

    // IE sometimes leaves a single paragraph, which can't be removed by the user
    if (!browser.clearsContentEditableCorrectly()) {
      quirks.ensureProperClearing(this);
    }

    // Fire global (before-)load event
    this.parent.fire("beforeload").fire("load");
    this._initLineBreaking();
    this._initMutationEvents();
  },

  _initMutationEvents: function() {
    var _this = this;
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    if (!MutationObserver) {
      var observer = new MutationObserver(function(records) {
        records.forEach(function(record) {
          _this._proccesAddedNodes(record.addedNodes)
        });
      });
      observer.observe(this.element, { 
        subtree: true,
        childList: true
      });
    } else {
      this.element.addEventListener("DOMSubtreeModified", function(e) {
        _this._proccesMutationEvent(e)
      }, false);
    }
  },

  _proccesMutationEvent: function(e) {
    var _this = this;
    var items = this.element.querySelectorAll("span[style]");
    if (items.length) {
      for (var i = items.length - 1; i >= 0; i--) {
        var item = items[i];
        item.removeAttribute("style");
      };
    }
  },

  _proccesAddedNodes: function(addedNodes) {
    var _this = this;
    for (var index = addedNodes.length - 1; index >= 0; index--) {
      node = addedNodes[index];
      if (node.nodeType == Node.ELEMENT_NODE && 
          node.nodeName == "SPAN" && 
          node.className != "_wysihtml5-temp-placeholder"
      ) {
        setTimeout(function() {
          _this.selection.executeAndRestore(function() {
            _this.cleanUp()
          });
        }, 0);
        return;
      }
    };
  },
  
  _initUndoManager: function() {
    this.undoManager = new UndoManager(this.parent);
  },
  
  _initLineBreaking: function() {
    var that = this,
        _this = this;
    
    dom.observe(this.element, ["focus", "keydown"], function() {
      if (that.isEmpty()) {
        var paragraph = that.doc.createElement("P");
        that.element.innerHTML = "";
        that.element.appendChild(paragraph);
        if (!browser.displaysCaretInEmptyContentEditableCorrectly()) {
          paragraph.innerHTML = "<br>";
          that.selection.setBefore(paragraph.firstChild);
        } else {
          that.selection.selectNode(paragraph, true);
        }
      }
    });
    
    // Under certain circumstances Chrome + Safari create nested <p>
    // or <h[1-6]> tags after paste Inserting an invisible white space
    // in front of it fixes the issue
    if (browser.createsNestedInvalidMarkupAfterPaste()) {
      dom.observe(this.element, "paste", function(event) {
        var invisibleSpace = that.doc.createTextNode(Constants.INVISIBLE_SPACE);
        that.selection.insertNode(invisibleSpace);
      });
    }

    dom.observe(this.element, "keydown", function(event) {
    });
  }, 

  _lastInsertedBlock: function(range, e) {
    var nativeRange = range.nativeRange;
    var startContainer = nativeRange.startContainer;
    if (nativeRange.collapsed) {
      var blockElement = dom.getParentElement(startContainer, { 
        nodeName: ["LI", "P", "H1", "H2", "H3", "H4", "H5", "H6", "PRE", "BLOCKQUOTE"]
      }, 4);
      if (blockElement) {

      }
    }
  },

  _lastInsertedWordRange: function(range) {
    var nativeRange = range.nativeRange;
    var startContainer = nativeRange.startContainer;
    if (nativeRange.collapsed && startContainer.nodeType == Node.TEXT_NODE) {
      var wordRange = nativeRange.cloneRange();
      var textContent = startContainer.textContent.slice(0, nativeRange.startOffset);
      var lastIndex = textContent.lastIndexOf(" ");
      if (lastIndex != -1) {
        wordRange.setStart(nativeRange.startContainer, (lastIndex + 1));
      } else {
        wordRange.setStart(startContainer, 0);
      }

    }
  },

    if (e.keyCode == Constants.SPACE_KEY) {
      var range = this.selection.getRange();

      };
    } else if (e.keyCode == Constants.ENTER_KEY) {
      var range = this.selection.getRange();
      var blockRange = this._lastInsertedBlock(range, e);
    }
  },

    for (var i = 0; i < this._keyboardHandlers.length; i++) {
      var keyboardHandler = this._keyboardHandlers[i];
      if (keyboardHandler.matcher(e)) {
      }
    };
  }
});

Composer.RegisterKeyboardHandler = function(matcher, callback) {
  Composer.prototype._keyboardHandlers.push({
    matcher: matcher, 
    callback: callback
  });
};

  Composer.prototype._textSubstitutions.push({
  });
};

export { Composer };
