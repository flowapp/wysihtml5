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
 *    paste
 *    paste:composer
 *    newword:composer
 *    undo:composer
 *    redo:composer
 *    beforecommand:composer
 *    aftercommand:composer
 *    enable:composer
 *    disable:composer
 */

import lang from "wysihtml5/lang";
import dom from "./dom";
import { browser } from "./browser";
import { Composer } from "./views/composer";
import quirks from "./quirks";

var defaultConfig = {
  // Give the editor a name, the name will also be set as class name on the iframe and on the iframe's body
  name: undefined,
  // Whether the editor should look like the textarea (by adopting styles)
  autoLink: true,
  // Object which includes parser rules to apply when html gets inserted via copy & paste
  // See parser_rules/*.js for examples
  parserRules: { tags: { br: {}, span: {}, div: {}, p: {} }, classes: {} },
  // Parser method to use when the user inserts content via copy & paste
  parser: dom.Parser,
  // Whether senseless <span> elements (empty or without attributes) should be removed/replaced with their content
  cleanUp: true,
  // Classname of container that editor should not touch and pass through
  // Pass false to disable
  uneditableContainerClassname: "wysihtml5-uneditable-container"
};

var Editor = lang.Dispatcher.extend(
  /** @scope wysihtml5.Editor.prototype */ {
  constructor: function(editableElement, config) {
    this.editableElement = editableElement; // Deprecated
    this.element = editableElement;
    this.config = lang.object({}).merge(defaultConfig).merge(config).get();

    this.composer = new Composer(this, this.editableElement, this.config);
    this.currentView = this.composer; // Deprecated
  },

  isCompatible: function() {
    return browser.supported();
  },

  clear: function() {
    this.composer.clear();
  },

  getValue: function(options) {
    return this.composer.getValue(options);
  },

  setValue: function(html, parse) {
    if (!html) {
      return this.clear();
    }

    this.composer.setValue(html, parse);
  },

  cleanUp: function() {
    this.composer.cleanUp();
  },

  focus: function(setToEnd) {
    this.composer.focus(setToEnd);
  },

  /**
   * Deactivate editor (make it readonly)
   */
  disable: function() {
    this.composer.disable();
  },

  /**
   * Activate editor
   */
  enable: function() {
    this.composer.enable();
  },

  // FIXUP
  isEmpty: function() {
    return this.composer.visuallyEmpty();
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
  }
});

export { Editor };
