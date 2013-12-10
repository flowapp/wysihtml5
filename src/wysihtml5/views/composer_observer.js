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
import quirks from "../quirks";
import lang from "wysihtml5/lang";

var newLineRegExp = /\n/g;

Composer.prototype.observe = function() {
  var that                = this,
      state               = this.getValue(),
      element             = this.element,
      pasteEvents         = ["drop", "paste"],
      interactionEvents   = ["drop", "paste", "mouseup", "focus", "keyup"];

  // --------- User interaction tracking --

  dom.observe(this.element, interactionEvents, function() {
    setTimeout(function() {
      that.parent.fire("interaction").fire("interaction:composer");
    }, 0);
  });


  // --------- Focus & blur logic ---------
  dom.observe(this.element, "focus", function() {
    that.parent.fire("focus").fire("focus:composer");

    // Delay storing of state until all focus handler are fired
    // especially the one which resets the placeholder
    setTimeout(function() { state = that.getValue(); }, 0);
  });

  dom.observe(this.element, "blur", function() {
    if (state !== that.getValue()) {
      that.parent.fire("change").fire("change:composer");
    }
    that.parent.fire("blur").fire("blur:composer");
  });

  // --------- Drag & Drop logic ---------
  dom.observe(element, ["cut", "copy"], function(e) {
    var clipboardData = e.clipboardData;
    if (clipboardData) {
      var range = that.selection.getRange();
      var plainText = range.toString();
      var content = range.cloneContents();

      var node = document.createElement("div");
      node.appendChild(content);

      clipboardData.setData("text/plain", plainText);
      clipboardData.setData("text/html", node.innerHTML);
      if (e.type == "cut") {
        range.deleteContents();
      }
      e.preventDefault();
    }
  });

  dom.observe(element, pasteEvents, function(e) {
    var clipboardData = e.clipboardData;
    if (clipboardData) {
      var range = that.selection.getRange();
      var host = document.createElement("div");
      var data = clipboardData.getData("text/html");
      if (data) {
        host.innerHTML = data;
        that.parent.parse(host);
      } else {
        data = clipboardData.getData("Text") || "";
        data = lang.string(data).escapeHTML();
        data = data.replace(newLineRegExp, "<br>");
        host.innerHTML = data;
      }
      that.selection.insertNode(host);
      e.preventDefault();
    } else {
      var keepScrollPosition = true;
      setTimeout(function() {
        that.selection.executeAndRestore(function() {
          quirks.cleanPastedHTML(that.element);
          that.parent.parse(that.element);
        }, keepScrollPosition);
      }, 0)
    }
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
      if (target.nodeName === "IMG") {
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
};
