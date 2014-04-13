/**
 * Selection API
 *
 * @example
 *    var selection = new wysihtml5.Selection(editor);
 */

import dom from "../dom";
import { Constants } from "../constants";
import lang from "wysihtml5/lang";
import { browser } from "../browser";
import { firstVisibleChild } from "../dom/first_visible_child";

var Selection = Base.extend({
  constructor: function(editor, composer, contain, unselectableClass) {
    // Make sure that our external range library is initialized
    window.rangy.init();

    this.editor = editor;
    this.composer = composer;
    this.doc = document;
    this.contain = contain;
    this.unselectableClass = unselectableClass || false;
  },

  /**
   * Get the current selection as a bookmark to be able to later restore it
   *
   * @return {Object} An object that represents the current selection
   */
  getBookmark: function() {
    var range = this.getRange();
    return range && range.cloneRange();
  },

  /**
   * Restore a selection retrieved via wysihtml5.Selection.prototype.getBookmark
   *
   * @param {Object} bookmark An object that represents the current selection
   */
  setBookmark: function(bookmark) {
    if (!bookmark) {
      return;
    }

    this.setSelection(bookmark);
  },

  /**
   * Set the caret in front of the given node
   *
   * @param {Object} node The element or text node where to position the caret in front of
   * @example
   *    selection.setBefore(myElement);
   */
  setBefore: function(node) {
    var range = rangy.createRange(this.doc);
    range.setStartBefore(node);
    range.setEndBefore(node);
    return this.setSelection(range);
  },

  /**
   * Set the caret after the given node
   *
   * @param {Object} node The element or text node where to position the caret in front of
   * @example
   *    selection.setBefore(myElement);
   */
  setAfter: function(node) {
    var range = rangy.createRange(this.doc);

    range.setStartAfter(node);
    range.setEndAfter(node);
    return this.setSelection(range);
  },

  /**
   * Ability to select/mark nodes
   *
   * @param {Element} node The node/element to select
   * @example
   *    selection.selectNode(document.getElementById("my-image"));
   */
  selectNode: function(node, avoidInvisibleSpace) {
    var range           = rangy.createRange(this.doc),
        isElement       = node.nodeType === Node.ELEMENT_NODE,
        canHaveHTML     = "canHaveHTML" in node ? node.canHaveHTML : (node.nodeName !== "IMG"),
        content         = isElement ? node.innerHTML : node.data,
        isEmpty         = (content === "" || content === Constants.INVISIBLE_SPACE),
        displayStyle    = dom.getStyle("display").from(node),
        isBlockElement  = (displayStyle === "block" || displayStyle === "list-item");

    if (isEmpty && isElement && canHaveHTML && !avoidInvisibleSpace) {
      // Make sure that caret is visible in node by inserting a zero width no breaking space
      try { node.innerHTML = Constants.INVISIBLE_SPACE; } catch(e) {}
    }

    if (canHaveHTML) {
      range.selectNodeContents(node);
    } else {
      range.selectNode(node);
    }

    if (canHaveHTML && isEmpty && isElement) {
      range.collapse(isBlockElement);
    } else if (canHaveHTML && isEmpty) {
      range.setStartAfter(node);
      range.setEndAfter(node);
    }

    this.setSelection(range);
  },

  /**
   * Get the node which contains the selection
   *
   * @param {Boolean} [controlRange] (only IE) Whether it should return the selected ControlRange element when the selection type is a "ControlRange"
   * @return {Object} The node that contains the caret
   * @example
   *    var nodeThatContainsCaret = selection.getSelectedNode();
   */
  getSelectedNode: function(controlRange) {
    var selection,
        range;

    if (controlRange && this.doc.selection && this.doc.selection.type === "Control") {
      range = this.doc.selection.createRange();
      if (range && range.length) {
        return range.item(0);
      }
    }

    selection = this.getSelection(this.doc);
    if (selection.focusNode === selection.anchorNode) {
      return selection.focusNode;
    } else {
      range = this.getRange(this.doc);
      return range ? range.commonAncestorContainer : this.doc.body;
    }
  },

  getSelectedOwnNodes: function(controlRange) {
    var selection,
        ranges = this.getOwnRanges(),
        ownNodes = [];

    for (var i = 0, maxi = ranges.length; i < maxi; i++) {
        ownNodes.push(ranges[i].commonAncestorContainer || this.doc.body);
    }
    return ownNodes;
  },

  findNodesInSelection: function(nodeTypes) {
    var ranges = this.getOwnRanges(),
        nodes = [], curNodes;
    for (var i = 0, maxi = ranges.length; i < maxi; i++) {
      curNodes = ranges[i].getNodes([1], function(node) {
          return lang.array(nodeTypes).contains(node.nodeName);
      });
      nodes = nodes.concat(curNodes);
    }
    return nodes;
  },

  containsUneditable: function() {
    var uneditables = this.getOwnUneditables(),
        selection = this.getSelection();

    for (var i = 0, maxi = uneditables.length; i < maxi; i++) {
      if (selection.containsNode(uneditables[i])) {
        return true;
      }
    }

    return false;
  },

  deleteContents: function()  {
    var ranges = this.getOwnRanges();
    for (var i = ranges.length; i--;) {
      ranges[i].deleteContents();
    }
    this.setSelection(ranges[0]);
  },

  getPreviousNode: function(node, ignoreEmpty) {
    if (!node) {
      var selection = this.getSelection();
      node = selection.anchorNode;
    }

    if (node === this.contain) {
        return false;
    }

    var ret = node.previousSibling,
        parent;

    if (ret === this.contain) {
        return false;
    }

    if (ret && ret.nodeType !== 3 && ret.nodeType !== 1) {
       // do not count comments and other node types
       ret = this.getPreviousNode(ret, ignoreEmpty);
    } else if (ret && ret.nodeType === 3 && (/^\s*$/).test(ret.textContent)) {
      // do not count empty textnodes as previus nodes
      ret = this.getPreviousNode(ret, ignoreEmpty);
    } else if (ignoreEmpty && ret && ret.nodeType === 1 && !lang.array(["BR", "HR", "IMG"]).contains(ret.nodeName) && (/^[\s]*$/).test(ret.innerHTML)) {
      // Do not count empty nodes if param set.
      // Contenteditable tends to bypass and delete these silently when deleting with caret
      ret = this.getPreviousNode(ret, ignoreEmpty);
    } else if (!ret && node !== this.contain) {
      parent = node.parentNode;
      if (parent !== this.contain) {
          ret = this.getPreviousNode(parent, ignoreEmpty);
      }
    }

    return (ret !== this.contain) ? ret : false;
  },

  caretIsInTheBeginnig: function() {
    var selection = this.getSelection();
    var node = selection.anchorNode;
    var offset = selection.anchorOffset;

    return (offset === 0 && !this.getPreviousNode(node, true));
  },

  caretIsAtStartOfNode: function(parentNode, selectedRange, selectedNode) {
    selectedRange = selectedRange || this.getRange();
    selectedNode = selectedNode || selectedRange.startContainer;
    var tester = function(node, until) {
      if (node === until) {
        return true;
      } else {
        var parent = node.parentNode;
        if (node === firstVisibleChild(parent)) {
          return tester(parent, until);
        }
        return false;
      }
    }
    if (selectedRange.startOffset === 0) {
      return tester(selectedNode, parentNode);
    }
    return false;
  },

  caretIsBeforeUneditable: function() {
    var selection = this.getSelection(),
        node = selection.anchorNode,
        offset = selection.anchorOffset;

    if (offset === 0) {
      var prevNode = this.getPreviousNode(node, true);
      if (prevNode) {
        var uneditables = this.getOwnUneditables();
        for (var i = 0, maxi = uneditables.length; i < maxi; i++) {
          if (prevNode === uneditables[i]) {
            return uneditables[i];
          }
        }
      }
    }
    return false;
  },

  caretIsAtEndOfNode: function(range, until) {
    if (this.caretIsAtEndOfRange(range)) {
      var parent = range.endContainer.parentNode;
      if (parent === until) {
        return true;
      }
      var newRange = document.createRange();
      newRange.selectNode(parent);
      return this.caretIsAtEndOfNode(newRange, parent, until);
    } else {
      return false;
    }
  },

  caretIsAtEndOfRange: function(range) {
    var endContainer = range.endContainer;
    switch (endContainer.nodeType) {
      case Node.ELEMENT_NODE:
        return endContainer.parentNode.childNodes.length > range.endOffset;
      case Node.TEXT_NODE:
        return endContainer.textContent.length == range.endOffset;
    }
  },

  insertElements: function(elements) {
    var range = this.getRange();
    if (!range.collapsed) {
      range.deleteContents();
      range = this.getRange();
    }

    var items = elements.map(function(node) {
      if (node.nodeType == Node.TEXT_NODE) {
        var fragment = document.createDocumentFragment();
        fragment.appendChild(node);
        return fragment;
      }
      return node;
    });

    var selectedNode = this.getSelectedNode();
    var oldLastChild;
    var blockElement = this.composer.parentElement(selectedNode, {
      nodeName: ["H1", "H2", "H3", "H4", "H5", "H6", "P", "PRE", "UL", "OL", "BLOCKQUOTE"]
    });

    if (!blockElement) {
      this.composer.ensureParagraph();
      blockElement = this.contain.querySelector("P") || this.contain.firstElementChild;
    }

    // Extract the tail of the current block
    var endRange = range.cloneRange();
    endRange.setEndAfter(blockElement.lastChild);

    if (endRange.toString()) {
      var documentFragment = endRange.extractContents();
      var lastChild = items[items.length - 1];
      oldLastChild = lastChild.lastChild;
      dom.appendChildNodes(documentFragment, lastChild);
    } else if (elements.length > 1) {
      oldLastChild = elements[elements.length - 1];
    }

    // Integrate the first block of content with the current block element
    var firstChild = items[0];
    if (firstChild) {
      items.shift();
      dom.appendChildNodes(firstChild, blockElement, (!!blockElement.textContent));
    }

    // Insert it
    var fragment = document.createDocumentFragment();
    items.forEach(function(element) {
      fragment.appendChild(element);
    });
    dom.insert(fragment).after(blockElement);

    // Restore the selection
    var item = oldLastChild || blockElement;
    if (item) {
      this.setAfter(item);
    }
  },

  // TODO: has problems in chrome 12. investigate block level and uneditable area inbetween
  executeAndRestore: function(method, restoreScrollPosition) {
    var body                  = this.doc.body,
        oldScrollTop          = restoreScrollPosition && body.scrollTop,
        oldScrollLeft         = restoreScrollPosition && body.scrollLeft,
        className             = "_wysihtml5-temp-placeholder",
        placeholderHtml       = '<span class="' + className + '">' + Constants.INVISIBLE_SPACE + '</span>',
        range                 = this.getRange(this.doc),
        caretPlaceholder,
        newCaretPlaceholder,
        nextSibling,
        node,
        newRange;

    // Nothing selected, execute and say goodbye
    if (!range) {
      method(body, body);
      return;
    }

    node = range.createContextualFragment(placeholderHtml);
    range.insertNode(node);

    // Make sure that a potential error doesn't cause our placeholder element to be left as a placeholder
    try {
      method(range.startContainer, range.endContainer);
    } catch(e) {
      setTimeout(function() { throw e; }, 0);
    }

    caretPlaceholder = this.doc.querySelector("." + className);
    if (caretPlaceholder) {
      newRange = rangy.createRange(this.doc);
      nextSibling = caretPlaceholder.nextSibling;

      newRange.selectNode(caretPlaceholder);
      newRange.deleteContents();
      this.setSelection(newRange);
    } else {
      // fallback for when all hell breaks loose
      body.focus();
    }

    if (restoreScrollPosition) {
      body.scrollTop  = oldScrollTop;
      body.scrollLeft = oldScrollLeft;
    }

    // Remove it again, just to make sure that the placeholder is definitely out of the dom tree
    try {
      caretPlaceholder.parentNode.removeChild(caretPlaceholder);
    } catch(e2) {}
  },

  /**
   * Different approach of preserving the selection (doesn't modify the dom)
   * Takes all text nodes in the selection and saves the selection position in the first and last one
   */
  executeAndRestoreSimple: function(method) {
    var range = this.getRange(),
        body  = this.doc.body,
        newRange,
        firstNode,
        lastNode,
        textNodes,
        rangeBackup;

    // Nothing selected, execute and say goodbye
    if (!range) {
      method(body, body);
      return;
    }

    textNodes = range.getNodes([3]);
    firstNode = textNodes[0] || range.startContainer;
    lastNode  = textNodes[textNodes.length - 1] || range.endContainer;

    rangeBackup = {
      collapsed:      range.collapsed,
      startContainer: firstNode,
      startOffset:    firstNode === range.startContainer ? range.startOffset : 0,
      endContainer:   lastNode,
      endOffset:      lastNode === range.endContainer ? range.endOffset : lastNode.length
    };

    // try {
      method(range.startContainer, range.endContainer);
    // } catch(e) {
    //   setTimeout(function() { throw e; }, 0);
    // }

    newRange = rangy.createRange(this.doc);
    try { newRange.setStart(rangeBackup.startContainer, rangeBackup.startOffset); } catch(e1) {}
    try { newRange.setEnd(rangeBackup.endContainer, rangeBackup.endOffset); } catch(e2) {}
    try { this.setSelection(newRange); } catch(e3) {}
  },

  set: function(node, offset) {
    var newRange = rangy.createRange(this.doc);
    newRange.setStart(node, offset || 0);
    this.setSelection(newRange);
  },

  /**
   * Insert html at the caret position and move the cursor after the inserted html
   *
   * @param {String} html HTML string to insert
   * @example
   *    selection.insertHTML("<p>foobar</p>");
   */
  insertHTML: function(html) {
    var range     = rangy.createRange(this.doc),
        node      = range.createContextualFragment(html),
        lastChild = node.lastChild;

    this.insertNode(node);
    if (lastChild) {
      this.setAfter(lastChild);
    }
  },

  /**
   * Insert a node at the caret position and move the cursor behind it
   *
   * @param {Object} node HTML string to insert
   * @example
   *    selection.insertNode(document.createTextNode("foobar"));
   */
  insertNode: function(node) {
    var range = this.getRange();
    if (range) {
      range.insertNode(node);
    }
  },

  /**
   * Wraps current selection with the given node
   *
   * @param {Object} node The node to surround the selected elements with
   */
  surround: function(nodeOptions) {
    var range = this.getRange();
    if (!range) {
      return null;
    }

    var node = document.createElement(nodeOptions.nodeName);
    if (nodeOptions.className) {
      node.className = nodeOptions.className;
    }
    try {
      // This only works when the range boundaries are not overlapping other elements
      range.surroundContents(node);
      this.selectNode(node);
    } catch(e) {
      // fallback
      node.appendChild(range.extractContents());
      range.insertNode(node);
    }
    return node;
  },

  deblockAndSurround: function(nodeOptions) {
    var tempElement = this.doc.createElement('div'),
        range = rangy.createRange(this.doc),
        tempDivElements,
        tempElements,
        firstChild;

    tempElement.className = nodeOptions.className;

    this.composer.commands.exec("formatBlock", nodeOptions.nodeName, nodeOptions.className);
    tempDivElements = this.contain.querySelectorAll("." + nodeOptions.className);
    if (tempDivElements[0]) {
      tempDivElements[0].parentNode.insertBefore(tempElement, tempDivElements[0]);

      range.setStartBefore(tempDivElements[0]);
      range.setEndAfter(tempDivElements[tempDivElements.length - 1]);
      tempElements = range.extractContents();

      while (tempElements.firstChild) {
        firstChild = tempElements.firstChild;
        if (firstChild.nodeType == 1 && firstChild.classList.contains(nodeOptions.className)) {
          while (firstChild.firstChild) {
            tempElement.appendChild(firstChild.firstChild);
          }
          if (firstChild.nodeName !== "BR") { tempElement.appendChild(this.doc.createElement('br')); }
          tempElements.removeChild(firstChild);
        } else {
          tempElement.appendChild(firstChild);
        }
      }
    } else {
      tempElement = null;
    }

    return tempElement;
  },

  /**
   * https://developer.mozilla.org/en/DOM/Selection/modify
   */
  selectLine: function() {
    var selection = window.getSelection();
    selection.modify("move", "left", "lineboundary");
    selection.modify("extend", "right", "lineboundary");
  },

  getText: function() {
    var selection = this.getSelection();
    return selection ? selection.toString() : "";
  },

  getNodes: function(nodeType, filter) {
    var range = this.getRange();
    if (range) {
      return range.getNodes([nodeType], filter);
    } else {
      return [];
    }
  },

  fixRangeOverflow: function(range) {
    if (this.contain && range) {
      var containment = range.compareNode(this.contain);
      if (containment !== 2) {
        if (containment === 1 && this.contain.firstChild) {
          range.setStartBefore(this.contain.firstChild);
        }
        if (containment === 0 && this.contain.lastChild) {
          range.setEndAfter(this.contain.lastChild);
        }
        if (containment === 3 && this.contain.firstChild && this.contain.lastChild) {
          range.setStartBefore(this.contain.firstChild);
          range.setEndAfter(this.contain.lastChild);
        }
      }
      if (this._detectInlineRangeProblems(range)) {
        var previousElementSibling = range.endContainer.previousElementSibling;
        if (previousElementSibling) {
          range.setEnd(previousElementSibling, this._endOffsetForNode(previousElementSibling));
        }
      }

      this._normalizeEndContainer(range)
    }
  },

  _normalizeEndContainer: function(range) {
    var endContainer = range.endContainer;
    if (endContainer.nodeType == Node.ELEMENT_NODE) {
      endContainer = endContainer.childNodes[range.endOffset - 1];
      if (endContainer) {
        endContainer = this._lastChild(endContainer);
        switch (endContainer.nodeType) {
          case Node.TEXT_NODE:
            var startOffset = endContainer.length;
            range.setEnd(endContainer, startOffset);
            if (range.collapsed) {
              range.setStart(endContainer, startOffset);
            }
            break;
          case Node.ELEMENT_NODE:
            var parent = endContainer.parentNode;
            var endOffset = parent.childNodes.length
            range.setEnd(parent, endOffset);
            if (range.collapsed) {
              range.setStart(parent, endOffset);
            }
            break;
        }
      }
    }
  },

  _lastChild: function(endContainer) {
    var container = endContainer.lastChild;
    if (container) {
      return this._lastChild(container);
    } else {
      return endContainer;
    }
  },

  _endOffsetForNode: function(node) {
    var range = document.createRange()
    range.selectNodeContents(node)
    return range.endOffset;
  },

  _detectInlineRangeProblems: function(range) {
    var position = range.startContainer.compareDocumentPosition(range.endContainer);
    return (
      range.endOffset == 0 &&
      position & Node.DOCUMENT_POSITION_FOLLOWING
    );
  },

  getRange: function() {
    var selection = this.getSelection(),
        range = selection && selection.rangeCount && selection.getRangeAt(0);

    try {
      this.fixRangeOverflow(range);
    } catch (e) {}

    return range;
  },

  getOwnUneditables: function() {
    var allUneditables = dom.query(this.contain, '.' + this.unselectableClass),
        deepUneditables = dom.query(allUneditables, '.' + this.unselectableClass);

    return lang.array(allUneditables).without(deepUneditables);
  },

  // Returns an array of ranges that belong only to this editable
  // Needed as uneditable block in contenteditabel can split range into pieces
  // If manipulating content reverse loop is usually needed as manipulation can shift subsequent ranges
  getOwnRanges: function()  {
    var ranges = [],
        r = this.getRange(),
        tmpRanges;

    if (r) { ranges.push(r); }

    if (this.unselectableClass && this.contain && r) {
      var uneditables = this.getOwnUneditables();
      if (uneditables.length > 0) {
        for (var i = 0, imax = uneditables.length; i < imax; i++) {
          var tmpRanges = [];
          for (var j = 0, jmax = ranges.length; j < jmax; j++) {
            if (ranges[j]) {
              switch (this._compareNode(ranges[j], uneditables[i])) {
                case 3:
                  //section begins before and ends after uneditable. spilt
                  var tmpRange = ranges[j].cloneRange();
                  tmpRange.setEndBefore(uneditables[i]);
                  tmpRanges.push(tmpRange);

                  tmpRange = ranges[j].cloneRange();
                  tmpRange.setStartAfter(uneditables[i]);
                  tmpRanges.push(tmpRange);
                  break;
                case 0:
                case 1:
                  // in all other cases uneditable does not touch selection. don’t modify
                  tmpRanges.push(ranges[j]);
              }
            }
            ranges = tmpRanges;
          }
        }
      }
    }
    return ranges;
  },

  _compareNode: function(range, node) {
    var nodeRange = document.createRange();
    try {
      nodeRange.selectNode(node);
    }
    catch (e) {
      nodeRange.selectNodeContents(node);
    }
    var nodeIsBefore = range.compareBoundaryPoints(Range.START_TO_START, nodeRange) == 1;
    var nodeIsAfter = range.compareBoundaryPoints(Range.END_TO_END, nodeRange) == -1;

    if (nodeIsBefore && !nodeIsAfter)
      return 0;
    if (!nodeIsBefore && nodeIsAfter)
      return 1;
    if (nodeIsBefore && nodeIsAfter)
      return 2;

    return 3;
  },

  getSelection: function() {
    return rangy.getSelection(this.doc.defaultView || this.doc.parentWindow);
  },

  setSelection: function(range) {
    var selection = rangy.getSelection(window);
    return selection.setSingleRange(range);
  },

  createRange: function() {
    return rangy.createRange(this.doc);
  },

  isCollapsed: function() {
    return this.getSelection().isCollapsed;
  }

});

export { Selection };
