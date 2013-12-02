import { browser} from "../browser";
import { Composer } from "../views/composer";
import { Constants } from "../constants";
import { dom } from "../dom";
import { getParentElement } from "../dom/get_parent_element";

var supportsDisablingOfAutoLinking = browser.canDisableAutoLinking();
var supportsAutoLinking = browser.doesAutoLinkingInContentEditable();

Composer.RegisterTextSubstitution(function(word) {
  return word.match(Constants.URL_REG_EXP);
}, function(editor, composer, range, textContent, e) {
  if (editor.config.autoLink) {
    var blockElement = getParentElement(composer.selection.getSelectedNode(), {
      nodeName: ["P", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "BLOCKQUOTE"]
    }, 4);

    if (blockElement) {
      composer.selection.executeAndRestore(function() {
        var selection = composer.selection.getSelection().nativeSelection;
        selection.removeAllRanges();
        selection.addRange(range);
        composer.commands.exec("createLink", textContent);
      });
    }
  }
}, {
  word: true,
  sentence: false
});
