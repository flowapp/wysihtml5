/**
 * Detect browser support for specific features
 */
import methodCache from "./helpers/method_cache";

var userAgent   = navigator.userAgent;
var testElement = document.createElement("div");
// Browser sniffing is unfortunately needed since some behaviors are very impractical to feature detect
var isIE = userAgent.indexOf("MSIE") !== -1 && userAgent.indexOf("Opera") === -1;
var isGecko = userAgent.indexOf("Gecko") !== -1 && userAgent.indexOf("KHTML") === -1;
var isWebKit = userAgent.indexOf("AppleWebKit/") !== -1;
var isChrome = userAgent.indexOf("Chrome/") !== -1;
var isOpera = userAgent.indexOf("Opera/") !== -1;

var browser = {
  /**
   * Exclude browsers that are not capable of displaying and handling
   * contentEditable as desired:
   *    - iPhone, iPad (tested iOS 4.2.2) and Android (tested 2.2) refuse to make contentEditables focusable
   *    - IE < 8 create invalid markup and crash randomly from time to time
   *
   * @return {Boolean}
   */
  supported: methodCache(function() {
    var hasContentEditableSupport = "contentEditable" in testElement;
    var hasEditingApiSupport = document.execCommand && document.queryCommandSupported && document.queryCommandState;
    return (hasContentEditableSupport && hasEditingApiSupport);
  }),

  /**
   * Whether the caret is correctly displayed in contentEditable elements
   * Firefox sometimes shows a huge caret in the beginning after focusing
   */
  displaysCaretInEmptyContentEditableCorrectly: function() {
    return isIE;
  },

  /**
   * Firefox on OSX navigates through history when hitting CMD + Arrow right/left
   */
  hasHistoryIssue: function() {
    return isGecko && navigator.platform.substr(0, 3) === "Mac";
  },

  /**
   * Checks whether a document supports a certain queryCommand
   * In particular, Opera needs a reference to a document that has a contentEditable in it's dom tree
   * in oder to report correct results
   *
   * @param {Object} doc Document object on which to check for a query command
   * @param {String} command The query command to check for
   * @return {Boolean}
   *
   * @example
   *    wysihtml5.browser.supportsCommand(document, "bold");
   */
  supportsCommand: (function() {
    // Following commands are supported but contain bugs in some browsers
    var buggyCommands = {
      // formatBlock fails with some tags (eg. <blockquote>)
      "formatBlock": isIE,
    };

    // Firefox throws errors for queryCommandSupported, so we have to build up our own object of supported commands
    var supported = {
      "insertHTML": isGecko
    };

    return function(doc, command) {
      var isBuggy = buggyCommands[command];
      if (!isBuggy) {
        // Firefox throws errors when invoking queryCommandSupported or queryCommandEnabled
        try {
          return doc.queryCommandSupported(command);
        } catch(e1) {}

        try {
          return doc.queryCommandEnabled(command);
        } catch(e2) {
          return !!supported[command];
        }
      }
      return false;
    };
  })(),

  /**
   * When clicking on images in IE, Opera and Firefox, they are selected, which makes it easy to interact with them.
   * Chrome and Safari both don't support this
   */
  canSelectImagesInContentEditable: function() {
    return isGecko || isIE || isOpera;
  },

  /**
   * Check whether the browser automatically closes tags that don't need to be opened
   */
  autoClosesUnclosedTags: methodCache(function() {
    var clonedTestElement = testElement.cloneNode(false);
    clonedTestElement.innerHTML = "<p><div></div>";
    var innerHTML = clonedTestElement.innerHTML.toLowerCase();
    return innerHTML === "<p></p><div></div>" || innerHTML === "<p><div></div></p>";
  }),

  /**
   * As of now (19.04.2011) only supported by Firefox 4 and Chrome
   * See https://developer.mozilla.org/en/DOM/Selection/modify
   */
  supportsSelectionModify: function() {
    return "getSelection" in window && "modify" in window.getSelection();
  }
};

export { browser };
