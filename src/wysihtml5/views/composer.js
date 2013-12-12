import dom from "../dom";
import lang from "wysihtml5/lang";
import quirks from "../quirks";
import { browser } from "../browser";
import { Constants } from "../constants";
import { Selection } from "../selection/selection";
import { Commands} from "../commands";
import { UndoManager } from "../undo_manager";

var Composer = Base.extend({
  name: "composer",
  browser: browser,
  dom: dom,

  // Needed for firefox in order to display a proper caret in an empty contentEditable
  CARET_HACK: "<br>",

  _keyboardHandlers: [],
  _textSubstitutions: [],

  constructor: function(parent, editableElement, config) {
    this.parent = parent;
    this.element = editableElement;
    this.config = config;
    this.doc = document;
    this.editableArea = editableElement;
    this._create();
    this._setupFakeSelectionEvents();
  },

  clear: function() {
    this.element.innerHTML = browser.displaysCaretInEmptyContentEditableCorrectly() ? "" : this.CARET_HACK;
    this._updateHasValueClass();
  },

  getValue: function(options) {
    var value;
    var element = this.element;

    if (!options) {
      options = {}
    }

    if (options.trim) {
      element = wysihtml5.dom.removeEmptyNodes(element);
    }

    value = this.isEmpty() ? "" : quirks.getCorrectInnerHTML(element);

    if (options.parse) {
      value = this.parent.parse(value);
    }

    return value;
  },

  setValue: function(html, parse) {
    if (parse) {
      html = this.parent.parse(html);
    }
    this.element.innerHTML = html;
    this._updateHasValueClass();
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
    if (document.querySelector(":focus") === this.element) {
      return;
    }
    this.element.focus();

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

  isEmpty: function() {
    return !this.element.textContent;
  },

  _create: function() {
    var that = this;
    this.doc = document;
    this.element = this.editableArea;
    this.cleanUp(); // cleans contenteditable on initiation as it may contain html

    // Make sure our selection handler is ready
    this.selection = new Selection(this.parent, this.element, this.config.uneditableContainerClassname);

    // Make sure commands dispatcher is ready
    this.commands  = new Commands(this.parent, this);

    // DEPRECATED
    dom.addClass(this.element, this.config.composerClassName);

    this.observe();

    // WTF
    var name = this.config.name;
    if (name) {
      dom.addClass(this.element, name);
    }

    this.enable();

    // Make sure that the browser avoids using inline styles whenever possible
    this.commands.exec("styleWithCSS", false);
    this.commands.exec("enableObjectResizing", false);
    this.commands.exec("insertBrOnReturn", false);

    this._initUndoManager();

    quirks.ensureProperClearing(this);

    // Fire global (before-)load event
    this.parent.fire("beforeload").fire("load");
    this._initLineBreaking();
  },

  _initUndoManager: function() {
    this.undoManager = new UndoManager(this);
  },

  _initLineBreaking: function() {
    var that = this,
        _this = this;

    dom.observe(this.element, ["focus", "keydown"], function(e) {
      if (e.type == "focus" || e.keyCode == Constants.BACKSPACE_KEY) {
        setTimeout(function() {
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
        }, 0);
      }
    });

    dom.observe(this.element, "keydown", function(event) {
      _this._handleKeyboardHandlers(event);
      _this._lookForTextSubstitution(event);
    });
  },

  // Text Substitutions

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
      return {
        range: wordRange,
        textContent: textContent.slice((lastIndex + 1))
      };
    }
  },

  _lookForTextSubstitution: function(e) {
    // Commit words on space and enter
    if (e.keyCode == Constants.SPACE_KEY || e.keyCode == Constants.ENTER_KEY) {
      var range = this.selection.getRange();
      var options = this._lastInsertedWordRange(range);
      if (options) {
        for (var index = 0; index < this._textSubstitutions.length; index++) {
          var textSubstitution = this._textSubstitutions[index];
          if (textSubstitution.options.word !== false && textSubstitution.matcher(options.textContent, e)) {
            textSubstitution.callback(this.parent, this, options.range, options.textContent, e);
          }
        }
      }
    }

    // Also commit paragraphs on enter
    if (e.keyCode == Constants.ENTER_KEY) {
      var range = this.selection.getRange();
      var blockRange = this._lastInsertedBlock(range, e);
    }
  },

  // Keyboard Processors

  _handleKeyboardHandlers: function(e) {
    for (var i = 0; i < this._keyboardHandlers.length; i++) {
      var keyboardHandler = this._keyboardHandlers[i];
      if (keyboardHandler.matcher(e)) {
        keyboardHandler.callback(this.parent, this, e);
      }
    };
  },

  _updateHasValueClass: function() {
    var VISUAL_BLOCKS, emptyText, containsVisualBlocks;
    VISUAL_BLOCKS = ["ul", "ol", "blockquote"]

    for(var i = 0; i < VISUAL_BLOCKS.length; i++) {
      if(this.element.querySelectorAll(VISUAL_BLOCKS[i]).length > 0) {
        containsVisualBlocks = true;
        break;
      }
    }

    emptyText = !containsVisualBlocks && this.isEmpty() && this.element.querySelectorAll("p").length <= 1;

    if(emptyText) {
      dom.removeClass(this.element, "has-value");
    } else {
      dom.addClass(this.element, "has-value");
    }
  }
});

Composer.RegisterKeyboardHandler = function(matcher, callback) {
  Composer.prototype._keyboardHandlers.push({
    matcher: matcher,
    callback: callback
  });
};

Composer.RegisterTextSubstitution = function(matcher, callback, options) {
  Composer.prototype._textSubstitutions.push({
    matcher: matcher,
    callback: callback,
    options: options
  });
};

export { Composer };
