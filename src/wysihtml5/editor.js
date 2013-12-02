/**
 * WYSIHTML5 Editor
 *
 * @param {Element} editableElement Reference to the textarea which should be turned into a rich text interface
 * @param {Object} [config] See defaultConfig object below for explanation of each individual config option
 *
 * @events
 *    load
 *    beforeload (for internal use only)
 *    focus
 *    focus:composer
 *    focus:textarea
 *    blur
 *    blur:composer
 *    blur:textarea
 *    change
 *    change:composer
 *    change:textarea
 *    paste
 *    paste:composer
 *    paste:textarea
 *    newword:composer
 *    destroy:composer
 *    undo:composer
 *    redo:composer
 *    beforecommand:composer
 *    aftercommand:composer
 *    enable:composer
 *    disable:composer
 *    change_view
 */

import lang from "wysihtml5/lang";
import dom from "./dom";
import { browser } from "./browser";
import { Composer } from "./views/composer";
import quirks from "./quirks";

var undef;

var defaultConfig = {
  // Give the editor a name, the name will also be set as class name on the iframe and on the iframe's body 
  name:                 undef,
  // Whether the editor should look like the textarea (by adopting styles)
  style:                true,
  // Whether urls, entered by the user should automatically become clickable-links
  autoLink:             true,
  // Includes table editing events and cell selection tracking 
  handleTables:         false,
  // Object which includes parser rules to apply when html gets inserted via copy & paste
  // See parser_rules/*.js for examples
  parserRules:          { tags: { br: {}, span: {}, div: {}, p: {} }, classes: {} },
  // Parser method to use when the user inserts content via copy & paste
  parser:               dom.Parser,
  // Class name which should be set on the contentEditable element in the created sandbox iframe, can be styled via the 'stylesheets' option
  composerClassName:    "wysihtml5-editor",
  // Class name to add to the body when the wysihtml5 editor is supported
  bodyClassName:        "wysihtml5-supported",
  // By default wysihtml5 will insert a <br> for line breaks, set this to false to use <p>
  useLineBreaks:        false,
  // Whether the rich text editor should be rendered on touch devices (wysihtml5 >= 0.3.0 comes with basic support for iOS 5)
  supportTouchDevices:  true,
  // Whether senseless <span> elements (empty or without attributes) should be removed/replaced with their content
  cleanUp:              true,
  // Whether to use div instead of secure iframe
  contentEditableMode: true,
  noTextarea: true,
  // Classname of container that editor should not touch and pass through
  // Pass false to disable 
  uneditableContainerClassname: "wysihtml5-uneditable-container"
};

var Editor = lang.Dispatcher.extend(
  /** @scope wysihtml5.Editor.prototype */ {
  constructor: function(editableElement, config) {
    this.editableElement  = editableElement;
    this.config           = lang.object({}).merge(defaultConfig).merge(config).get();
    this._isCompatible    = browser.supported();
    
    // Sort out unsupported/unwanted browsers here
    if (!this._isCompatible || (!this.config.supportTouchDevices && browser.isTouchDevice())) {
      var that = this;
      setTimeout(function() { that.fire("beforeload").fire("load"); }, 0);
      return;
    }
    
    // Add class name to body, to indicate that the editor is supported
    dom.addClass(document.body, this.config.bodyClassName);
    
    this.composer = new Composer(this, this.editableElement, this.config);
    this.currentView = this.composer;
    
    if (typeof(this.config.parser) === "function") {
      this._initParser();
    }
  },
  
  isCompatible: function() {
    return this._isCompatible;
  },

  clear: function() {
    this.currentView.clear();
    return this;
  },

  getValue: function(parse) {
    return this.currentView.getValue(parse);
  },

  setValue: function(html, parse) {
    if (!html) {
      return this.clear();
    }
    
    this.currentView.setValue(html, parse);
    return this;
  },
  
  cleanUp: function() {
      this.currentView.cleanUp();
  },

  focus: function(setToEnd) {
    this.currentView.focus(setToEnd);
    return this;
  },

  /**
   * Deactivate editor (make it readonly)
   */
  disable: function() {
    this.currentView.disable();
    return this;
  },
  
  /**
   * Activate editor
   */
  enable: function() {
    this.currentView.enable();
    return this;
  },
  
  isEmpty: function() {
    return this.currentView.isEmpty();
  },
  
  parse: function(htmlOrElement) {
    var returnValue = this.config.parser(htmlOrElement, {
      rules: this.config.parserRules,
      cleanUp: this.config.cleanUp,
      context: document,
      uneditableClass: this.config.uneditableContainerClassname
    });

    if (typeof(htmlOrElement) === "object") {
      quirks.redraw(htmlOrElement);
    }
    return returnValue;
  },
  
  /**
   * Prepare html parser logic
   *  - Observes for paste and drop
   */
  _initParser: function() {
    this.on("paste:composer", function() {
      var keepScrollPosition  = true,
          that                = this;
      that.composer.selection.executeAndRestore(function() {
        quirks.cleanPastedHTML(that.composer.element);
        that.parse(that.composer.element);
      }, keepScrollPosition);
    });
  }
});

export { Editor };