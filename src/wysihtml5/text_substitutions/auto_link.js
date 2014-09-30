import { browser} from "../browser";
import { Composer } from "../views/composer";
import { Constants } from "../constants";
import { dom } from "../dom";

var supportsDisablingOfAutoLinking = browser.canDisableAutoLinking();
var supportsAutoLinking = browser.doesAutoLinkingInContentEditable();
var INCLUDES_PROTOCOL = /^(https?:\/\/|mailto:)/;


var validContainer = function(node, composer) {
  var blockElement = composer.parentElement(node, {
    nodeName: ["P", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "BLOCKQUOTE", "A"]
  });
  return (blockElement && blockElement.nodeName !== "A");
}

var addProtocolIfNeeded = function(url) {
  if (!INCLUDES_PROTOCOL.test(url)) {
    return "http://"+ url;
  }
  return url;
}

var convertRangeToURL = function(composer, range, URL) {
  composer.selection.executeAndRestore(function() {
    var selection = composer.selection.getSelection().nativeSelection;
    selection.removeAllRanges();
    selection.addRange(range);
    composer.commands.exec("createLink", addProtocolIfNeeded(URL));
  });
}

Composer.RegisterTextSubstitution(function(word, event, editor, composer, range) {
  return (
    editor.config.autoLink &&
    word.match(Constants.URL_REG_EXP) &&
    validContainer(range.commonAncestorContainer, composer)
  );
}, function(editor, composer, range, textContent, e) {
  convertRangeToURL(composer, range, textContent);
}, {
  word: true,
  sentence: false
});

Composer.RegisterTextSubstitution(function(word, event, editor, composer) {
  return editor.config.autoLink && word.match(Constants.URL_REG_EXP_NON_START);
}, function(editor, composer, range, textContent, e) {
  if (validContainer(range.commonAncestorContainer, composer)) {
    var regExp = Constants.URL_REG_EXP_NON_START;
    regExp.lastIndex = 0;

    var match;
    var matches = [];

    while (match = regExp.exec(textContent)) {
      matches.push(match);
    }

    regExp.lastIndex = 0;
    matches.reverse().forEach(function(match) {
      var content = match[0];
      var linkRange = document.createRange();
      linkRange.setStart(range.startContainer, match.index);
      linkRange.setEnd(range.startContainer, match.index + content.length);
      convertRangeToURL(composer, linkRange, content);
    });
  }
}, {
  word: false,
  sentence: true
});
