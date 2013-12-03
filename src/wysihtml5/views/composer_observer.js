/**
 * Taking care of events
 *  - Simulating 'change' event on contentEditable element
 *  - Handling drag & drop logic
 *  - Catch paste events
 *  - Dispatch proprietary newword:composer event
 *  - Keyboard shortcuts
 */
import { Composer } from "./composer";
import dom from "../dom";
import { redraw } from "../quirks/redraw"
import { browser } from "../browser";
import { Constants } from "../constants";
import lang from "wysihtml5/lang";

var shortcuts = {
    "66": "bold",     // B
    "73": "italic",   // I
    "85": "underline" // U
  };

Composer.prototype.observe = function() {
  var that                = this,
      state               = this.getValue(),
      container           = (this.sandbox.getIframe) ? this.sandbox.getIframe() : this.sandbox.getContentEditable(),
      element             = this.element,
      focusBlurElement    = (browser.supportsEventsInIframeCorrectly() || this.sandbox.getContentEditable) ? element : this.sandbox.getWindow(),
      pasteEvents         = ["drop", "paste"],
      interactionEvents   = ["drop", "paste", "mouseup", "focus", "keyup"];

  // --------- User interaction tracking --

  dom.observe(focusBlurElement, interactionEvents, function() {
    setTimeout(function() {
      that.parent.fire("interaction").fire("interaction:composer");
    }, 0);
  });


  // --------- Focus & blur logic ---------
  dom.observe(focusBlurElement, "focus", function() {
    that.parent.fire("focus").fire("focus:composer");

    // Delay storing of state until all focus handler are fired
    // especially the one which resets the placeholder
    setTimeout(function() { state = that.getValue(); }, 0);
  });

  dom.observe(focusBlurElement, "blur", function() {
    if (state !== that.getValue()) {
      that.parent.fire("change").fire("change:composer");
    }
    that.parent.fire("blur").fire("blur:composer");
  });

  // --------- Drag & Drop logic ---------

  dom.observe(element, pasteEvents, function() {
    setTimeout(function() {
      that.parent.fire("paste").fire("paste:composer");
    }, 0);
  });

  // --------- neword event ---------
  dom.observe(element, "keyup", function(event) {
    var keyCode = event.keyCode;
    if (keyCode === Constants.SPACE_KEY || keyCode === Constants.ENTER_KEY) {
      that.parent.fire("newword:composer");
    }
  });

  this.parent.on("paste:composer", function() {
    setTimeout(function() { that.parent.fire("newword:composer"); }, 0);
  });

  // --------- Make sure that images are selected when clicking on them ---------
  if (!browser.canSelectImagesInContentEditable()) {
    dom.observe(element, "mousedown", function(event) {
      var target = event.target;
      var allImages = element.querySelectorAll('img'),
          notMyImages = element.querySelectorAll('.' + that.config.uneditableContainerClassname + ' img'),
          myImages = lang.array(allImages).without(notMyImages);

      if (target.nodeName === "IMG" && lang.array(myImages).contains(target)) {
        that.selection.selectNode(target);
      }
    });
  }

  if (!browser.canSelectImagesInContentEditable()) {
      dom.observe(element, "drop", function(event) {
          // TODO: if I knew how to get dropped elements list from event I could limit it to only IMG element case
          setTimeout(function() {
              that.selection.getSelection().removeAllRanges();
          }, 0);
      });
  }

  if (browser.hasHistoryIssue() && browser.supportsSelectionModify()) {
    dom.observe(element, "keydown", function(event) {
      if (!event.metaKey && !event.ctrlKey) {
        return;
      }

      var keyCode   = event.keyCode,
          win       = element.ownerDocument.defaultView,
          selection = win.getSelection();

      if (keyCode === 37 || keyCode === 39) {
        if (keyCode === 37) {
          selection.modify("extend", "left", "lineboundary");
          if (!event.shiftKey) {
            selection.collapseToStart();
          }
        }
        if (keyCode === 39) {
          selection.modify("extend", "right", "lineboundary");
          if (!event.shiftKey) {
            selection.collapseToEnd();
          }
        }
        event.preventDefault();
      }
    });
  }

  // --------- Shortcut logic ---------
  dom.observe(element, "keydown", function(event) {
    var keyCode  = event.keyCode,
        command  = shortcuts[keyCode];
    if ((event.ctrlKey || event.metaKey) && !event.altKey && command) {
      that.commands.exec(command);
      event.preventDefault();
    }
    if (keyCode == 8) {

      if (that.selection.isCollapsed()) {
        if (that.selection.caretIsInTheBeginnig()) {
          event.preventDefault();
        } else {
          var beforeUneditable = that.selection.caretIsBeforeUneditable();
          if (beforeUneditable) {
            event.preventDefault();

            // TODO: take the how to delete around uneditable out of here
            // merge node with previous node from uneditable
            var prevNode = that.selection.getPreviousNode(beforeUneditable, true),
                curNode = that.selection.getSelectedNode();

            if (curNode.nodeType !== 1 && curNode.parentNode !== element) { curNode = curNode.parentNode; }
            if (prevNode) {
              if (curNode.nodeType == 1) {
                var first = curNode.firstChild;

                if (prevNode.nodeType == 1) {
                  while (curNode.firstChild) {
                    prevNode.appendChild(curNode.firstChild);
                  }
                } else {
                  while (curNode.firstChild) {
                    beforeUneditable.parentNode.insertBefore(curNode.firstChild, beforeUneditable);
                  }
                }
                if (curNode.parentNode) {
                  curNode.parentNode.removeChild(curNode);
                }
                that.selection.setBefore(first);
              } else {
                if (prevNode.nodeType == 1) {
                  prevNode.appendChild(curNode);
                } else {
                  beforeUneditable.parentNode.insertBefore(curNode, beforeUneditable);
                }
                that.selection.setBefore(curNode);
              }
            }
          }

        }
      } else if (that.selection.containsUneditable()) {
        event.preventDefault();
        that.selection.deleteContents();
      }

    }
  });

  // --------- Make sure that when pressing backspace/delete on selected images deletes the image and it's anchor ---------
  dom.observe(element, "keydown", function(event) {
    var target  = that.selection.getSelectedNode(true),
        keyCode = event.keyCode,
        parent;
    if (target && target.nodeName === "IMG" && (keyCode === Constants.BACKSPACE_KEY || keyCode === Constants.DELETE_KEY)) {
      parent = target.parentNode;
      // delete the <img>
      parent.removeChild(target);
      // and it's parent <a> too if it hasn't got any other child nodes
      if (parent.nodeName === "A" && !parent.firstChild) {
        parent.parentNode.removeChild(parent);
      }

      setTimeout(function() { redraw(element); }, 0);
      event.preventDefault();
    }
  });
};
