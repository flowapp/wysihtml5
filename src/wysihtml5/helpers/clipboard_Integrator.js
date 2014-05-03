import { Constants } from "../constants";
import { appendChildNodes } from "../dom/append_child_nodes";
import { nodeList } from "../dom/node_list";
import { fromPlainText } from "../helpers/from_plain_text";
import { removeEmptyTextNodes } from "../dom/remove_empty_text_nodes";
import { splitNode } from "../helpers/split_node";

var ClipboardIntegrator = Base.extend({
  constructor: function(composer) {
    this.composer = composer;
    this.selection = composer.selection;
  },

  set: function(content, mime) {
    if (mime === "text/html") {
      var host = document.createElement("div");
      host.innerHTML = content;
      this.composer.parent.parse(host);
      host.normalize();
      removeEmptyTextNodes(host);
      var fragment = nodeList.toArray(host.childNodes);

      for (var i = 0; i < fragment.length; i++) {
        if (fragment[i].nodeType == Node.TEXT_NODE) {
          fragment[i] = fromPlainText(fragment[i].textContent)[0];
        }
      }

      this.elements = fragment;
    } else if (mime === "text/plain") {
      var fragment = content.split(/\n+/);
      for (var i = 0; i < fragment.length; i++) {
        fragment[i] = document.createTextNode(fragment[i]);
      }
      this.elements = fragment;
    }
  },

  integrate: function() {
    var restore = {
      endIntegration: undefined,
      onlyChild: undefined,
      multipleChildren: undefined
    };

    var elements = this.elements;
    var range = this.selection.getRange();
    var orginallyCollapsed = range.collapsed;
    var orginalEndContainer = this._nearestBlock(range.endContainer);
    var orginalStartContainer = this._nearestBlock(range.startContainer);

    if (!range.collapsed) {
      range.deleteContents();
      range = this.selection.getRange();
    }

    var items = elements.map(function(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        var fragment = document.createDocumentFragment();
        fragment.appendChild(node);
        return fragment;
      }
      return node;
    });

    var selectedNode = this.selection.getSelectedNode();
    //var oldLastChild;
    var blockElement = this.composer.parentElement(selectedNode, {
      nodeName: ["H1", "H2", "H3", "H4", "H5", "H6", "P", "PRE", "UL", "OL", "BLOCKQUOTE", "LI"]
    });

    if (!blockElement) {
      this.composer.ensureParagraph({force: true});
      blockElement = this.selection.contain.querySelector("P") || this.selection.contain.firstElementChild;
    }
    var blockElementWasOriginallyEmpty = !blockElement.textContent;

    // Extract the tail of the current block
    var endRange = range.cloneRange();
    endRange.setEndAfter(blockElement.lastChild);
    if (endRange.toString()) {
      var documentFragment = endRange.extractContents();
      var lastChild = items[items.length - 1];

      if (orginallyCollapsed) {
        this._insertTrailingWhitespaceIfNeeded(lastChild, documentFragment.firstChild);
      }
      restore.endIntegration = lastChild.lastChild;
      console.log("restore.endIntegration: ", restore.endIntegration);
      appendChildNodes(documentFragment, lastChild);
    } else {
      if (orginalEndContainer) {
        if (orginalEndContainer !== orginalStartContainer && !orginalEndContainer.textContent) {
          orginalEndContainer.parentNode.removeChild(orginalEndContainer);
        }
        if (orginalEndContainer.textContent && !orginallyCollapsed && blockElement != orginalEndContainer) {
          var lastChild = items[items.length - 1];
          appendChildNodes(orginalEndContainer, lastChild);
          orginalEndContainer.parentNode.removeChild(orginalEndContainer);
        }
      }
    }

    // Integrate the first block of content with the current block element
    var firstChild = items[0];
    if (firstChild) {
      items.shift();
      // Only if it’s not empty or the pasted content is not a block element
      // Or empty and a list item
      var emptyListItem = blockElementWasOriginallyEmpty && blockElement.nodeName === "LI"
      if (!blockElementWasOriginallyEmpty || firstChild.nodeType === Node.TEXT_NODE || emptyListItem) {
        if (orginallyCollapsed) {
          this._insertTrailingWhitespaceIfNeeded(blockElement);
        }
        appendChildNodes(firstChild, blockElement, (!!blockElement.textContent));
      } else {
        if (firstChild.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
          firstChild = this._createContainerForNode(firstChild, blockElement.nodeName);
        }

        blockElement.parentNode.replaceChild(firstChild, blockElement);
        blockElement = firstChild;
      }
      restore.onlyChild = blockElement;
    }

    // Insert it
    var fragment = document.createDocumentFragment();

    items.forEach(function(element) {
      element = this._createContainerForNode(element, blockElement.nodeName);
      fragment.appendChild(element);
    }.bind(this));
    var lastChild = fragment.lastChild;
    restore.multipleChildren = lastChild && (lastChild.lastChild || lastChild); // Great line of code
    this._insert(fragment, blockElement);

    var item = restore.endIntegration || restore.multipleChildren || restore.onlyChild;
    if (item) {
      console.log(item, item.parentNode);
      this.selection.setAfter(item);
    }
  },

  _insert: function(fragment, after) {
    if (!fragment.firstChild) {
      // Nothing todo
      return;
    }

    if (after.nodeName === "LI" && fragment.firstChild.nodeName !== "LI") {
      var fork = splitNode(after);
      if (fork) {
        fork.parentNode.insertBefore(fragment, fork);
        return;
      }
      // Create host
      after = after.parentNode;
    }
    after.parentNode.insertBefore(fragment, after.nextSibling);
  },

  _createContainerForNode: function(node, context) {
    if (node.nodeType === Node.TEXT_NODE) {
      // TODO take context into account
      var element = document.createElement("p");
      element.appendChild(node);
      return element;
    } else if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      // TODO take context into account
      var element = document.createElement(context || "p");
      element.appendChild(node);
      return element;
    } else if (node.nodeName === "DIV") {
      console.log("Fuck");
    }
    return node;
  },

  _nearestBlock: function(node) {
    return this.composer.parentElement(node, {
      nodeName: Constants.BLOCK_ELEMENTS
    });
  },

  _insertTrailingWhitespaceIfNeeded: function(existingNode, theOtherNode) {
    if (theOtherNode) {
      var content = theOtherNode.textContent;
      if (content.trimLeft() !== content) {
        return;
      }
    }

    var content = existingNode.textContent;
    if (content && content.trimRight() === content) {
      var textNode = document.createTextNode(" ");
      existingNode.appendChild(textNode);
    }
  }
});

ClipboardIntegrator.RegisterMIME = function(mime, parser) {

};

export default = ClipboardIntegrator;
