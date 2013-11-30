(function(wysihtml5) {
  var dom       = wysihtml5.dom,
      browser   = wysihtml5.browser;
  
  wysihtml5.views.Composer = wysihtml5.views.View.extend(
    /** @scope wysihtml5.views.Composer.prototype */ {
    name: "composer",

    // Needed for firefox in order to display a proper caret in an empty contentEditable
    CARET_HACK: "<br>",

    _keyboardHandlers: [],
    _textSubstitutions: [],

    constructor: function(parent, editableElement, config) {
      this.base(parent, editableElement, config);
      if (!this.config.noTextarea) {
          this.textarea = this.parent.textarea;
      } else {
          this.editableArea = editableElement;
      }
      if (this.config.contentEditableMode) {
          this._initContentEditableArea();
      } else {
          this._initSandbox();
      }
    },

    clear: function() {
      this.element.innerHTML = browser.displaysCaretInEmptyContentEditableCorrectly() ? "" : this.CARET_HACK;
    },

    getValue: function(parse) {
      var value = this.isEmpty() ? "" : wysihtml5.quirks.getCorrectInnerHTML(this.element);
      
      if (parse) {
        value = this.parent.parse(value);
      }

      return value;
    },

    setValue: function(html, parse) {
      if (parse) {
        html = this.parent.parse(html);
      }
      
      try {
        this.element.innerHTML = html;
      } catch (e) {
        this.element.innerText = html;
      }
    },
    
    cleanUp: function() {
        this.parent.parse(this.element);
    },

    show: function() {
      this.editableArea.style.display = this._displayStyle || "";
      
      if (!this.config.noTextarea && !this.textarea.element.disabled) {
        // Firefox needs this, otherwise contentEditable becomes uneditable
        this.disable();
        this.enable();
      }
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
      // IE 8 fires the focus event after .focus()
      // This is needed by our simulate_placeholder.js to work
      // therefore we clear it ourselves this time
      if (wysihtml5.browser.doesAsyncFocus() && this.hasPlaceholderSet()) {
        this.clear();
      }
      
      this.base();
      
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

    hasPlaceholderSet: function() {
      return this.getTextContent() == ((this.config.noTextarea) ? this.editableArea.getAttribute("data-placeholder") : this.textarea.element.getAttribute("placeholder")) && this.placeholderSet;
    },

    isEmpty: function() {
      var innerHTML = this.element.innerHTML.toLowerCase();
      return innerHTML === ""            ||
             innerHTML === "<br>"        ||
             innerHTML === "<p></p>"     ||
             innerHTML === "<p><br></p>" ||
             this.hasPlaceholderSet();
    },
    
    _initContentEditableArea: function() {
        var that = this;
        
        if (this.config.noTextarea) {
            this.sandbox = new dom.ContentEditableArea(function() {
                that._create();
            }, {}, this.editableArea);
        } else {
            this.sandbox = new dom.ContentEditableArea(function() {
                that._create();
            });
            this.editableArea = this.sandbox.getContentEditable();
            dom.insert(this.editableArea).after(this.textarea.element);
        }
    },

    _initSandbox: function() {
      var that = this;
      
      this.sandbox = new dom.Sandbox(function() {
        that._create();
      }, {
        stylesheets:  this.config.stylesheets
      });
      this.editableArea  = this.sandbox.getIframe();
      
      var textareaElement = this.textarea.element;
      dom.insert(this.editableArea).after(textareaElement);
    },
    
    _create: function() {
      var that = this;
      this.doc                = this.sandbox.getDocument();
      this.element            = (this.config.contentEditableMode) ? this.sandbox.getContentEditable() : this.doc.body;
      if (!this.config.noTextarea) {
          this.textarea           = this.parent.textarea;
          this.element.innerHTML  = this.textarea.getValue(true);
      } else {
          this.cleanUp(); // cleans contenteditable on initiation as it may contain html
      }
      
      // Make sure our selection handler is ready
      this.selection = new wysihtml5.Selection(this.parent, this.element, this.config.uneditableContainerClassname);
      
      // Make sure commands dispatcher is ready
      this.commands  = new wysihtml5.Commands(this.parent);
      
      if (!this.config.noTextarea) {
          dom.copyAttributes([
              "className", "spellcheck", "title", "lang", "dir", "accessKey"
          ]).from(this.textarea.element).to(this.element);
      }
      
      dom.addClass(this.element, this.config.composerClassName);
      // 
      // Make the editor look like the original textarea, by syncing styles
      if (this.config.style && !this.config.contentEditableMode) {
        this.style();
      }
      
      this.observe();
      
      var name = this.config.name;
      if (name) {
        dom.addClass(this.element, name);
        if (!this.config.contentEditableMode) { dom.addClass(this.editableArea, name); }
      }
      
      this.enable();
      
      if (!this.config.noTextarea && this.textarea.element.disabled) {
        this.disable();
      }
      
      // Simulate html5 placeholder attribute on contentEditable element
      var placeholderText = typeof(this.config.placeholder) === "string"
        ? this.config.placeholder
        : ((this.config.noTextarea) ? this.editableArea.getAttribute("data-placeholder") : this.textarea.element.getAttribute("placeholder"));
      if (placeholderText) {
        dom.simulatePlaceholder(this.parent, this, placeholderText);
      }
      
      // Make sure that the browser avoids using inline styles whenever possible
      this.commands.exec("styleWithCSS", false);
      
      this._initAutoLinking();
      this._initObjectResizing();
      this._initUndoManager();
      
      // Simulate html5 autofocus on contentEditable element
      // This doesn't work on IOS (5.1.1)
      if (!this.config.noTextarea && (this.textarea.element.hasAttribute("autofocus") || document.querySelector(":focus") == this.textarea.element) && !browser.isIos()) {
        setTimeout(function() { that.focus(true); }, 100);
      }
      
      // IE sometimes leaves a single paragraph, which can't be removed by the user
      if (!browser.clearsContentEditableCorrectly()) {
        wysihtml5.quirks.ensureProperClearing(this);
      }
      
      // Set up a sync that makes sure that textarea and editor have the same content
      if (this.initSync && this.config.sync) {
        this.initSync();
      }
      
      // Okay hide the textarea, we are ready to go
      if (!this.config.noTextarea) { this.textarea.hide(); }
      
      // Fire global (before-)load event
      this.parent.fire("beforeload").fire("load");
      this._initLineBreaking();
      this._initMutationEvents()

    },

    _initMutationEvents: function() {
      var _this = this;
      var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
      if (!MutationObserver) {
        var observer = new MutationObserver(function(records) {
          records.forEach(function(record) {
            _this._proccesAddedNodes(record.addedNodes)
          });
        });
        observer.observe(this.element, { 
          subtree: true,
          childList: true
        });
      } else {
        this.element.addEventListener("DOMSubtreeModified", function(e) {
          _this._proccesMutationEvent(e)
        }, false);
      }
    },

    _proccesMutationEvent: function(e) {
      var _this = this;
      var items = this.element.querySelectorAll("span[style]");
      if (items.length) {
        for (var i = items.length - 1; i >= 0; i--) {
          var item = items[i];
          item.removeAttribute("style");
        };
      }
    },

    _proccesAddedNodes: function(addedNodes) {
      var _this = this;
      for (var index = addedNodes.length - 1; index >= 0; index--) {
        node = addedNodes[index];
        if (node.nodeType == Node.ELEMENT_NODE && 
            node.nodeName == "SPAN" && 
            node.className != "_wysihtml5-temp-placeholder"
        ) {
          setTimeout(function() {
            _this.selection.executeAndRestore(function() {
              _this.cleanUp()
            });
          }, 0);
          return;
        }
      };
    },

    _initAutoLinking: function() {
      var that                           = this,
          supportsDisablingOfAutoLinking = browser.canDisableAutoLinking(),
          supportsAutoLinking            = browser.doesAutoLinkingInContentEditable();
      if (supportsDisablingOfAutoLinking) {
        this.commands.exec("autoUrlDetect", false);
      }

      if (!this.config.autoLink) {
        return;
      }

      // Only do the auto linking by ourselves when the browser doesn't support auto linking
      // OR when he supports auto linking but we were able to turn it off (IE9+)
      if (!supportsAutoLinking || (supportsAutoLinking && supportsDisablingOfAutoLinking)) {
        this.parent.on("newword:composer", function() {
          if (dom.getTextContent(that.element).match(dom.autoLink.URL_REG_EXP)) {
            that.selection.executeAndRestore(function(startContainer, endContainer) {
              dom.autoLink(endContainer.parentNode);
            });
          }
        });
        
        dom.observe(this.element, "blur", function() {
          dom.autoLink(that.element);
        });
      }

      // Assuming we have the following:
      //  <a href="http://www.google.de">http://www.google.de</a>
      // If a user now changes the url in the innerHTML we want to make sure that
      // it's synchronized with the href attribute (as long as the innerHTML is still a url)
      var // Use a live NodeList to check whether there are any links in the document
          links           = this.sandbox.getDocument().getElementsByTagName("a"),
          // The autoLink helper method reveals a reg exp to detect correct urls
          urlRegExp       = dom.autoLink.URL_REG_EXP,
          getTextContent  = function(element) {
            var textContent = wysihtml5.lang.string(dom.getTextContent(element)).trim();
            if (textContent.substr(0, 4) === "www.") {
              textContent = "http://" + textContent;
            }
            return textContent;
          };

      dom.observe(this.element, "keydown", function(event) {
        if (!links.length) {
          return;
        }

        var selectedNode = that.selection.getSelectedNode(event.target.ownerDocument),
            link         = dom.getParentElement(selectedNode, { nodeName: "A" }, 4),
            textContent;

        if (!link) {
          return;
        }

        textContent = getTextContent(link);
        // keydown is fired before the actual content is changed
        // therefore we set a timeout to change the href
        setTimeout(function() {
          var newTextContent = getTextContent(link);
          if (newTextContent === textContent) {
            return;
          }

          // Only set href when new href looks like a valid url
          if (newTextContent.match(urlRegExp)) {
            link.setAttribute("href", newTextContent);
          }
        }, 0);
      });
    },

    _initObjectResizing: function() {
      this.commands.exec("enableObjectResizing", true);
      
      // IE sets inline styles after resizing objects
      // The following lines make sure that the width/height css properties
      // are copied over to the width/height attributes
      if (browser.supportsEvent("resizeend")) {
        var properties        = ["width", "height"],
            propertiesLength  = properties.length,
            element           = this.element;
        
        dom.observe(element, "resizeend", function(event) {
          var target = event.target || event.srcElement,
              style  = target.style,
              i      = 0,
              property;
          
          if (target.nodeName !== "IMG") {
            return;
          }
          
          for (; i<propertiesLength; i++) {
            property = properties[i];
            if (style[property]) {
              target.setAttribute(property, parseInt(style[property], 10));
              style[property] = "";
            }
          }
          
          // After resizing IE sometimes forgets to remove the old resize handles
          wysihtml5.quirks.redraw(element);
        });
      }
    },
    
    _initUndoManager: function() {
      this.undoManager = new wysihtml5.UndoManager(this.parent);
    },
    
    _initLineBreaking: function() {
      var that                              = this,
          _this = this,
          BLOCK_ELEMENTS                    = ["PRE", "BLOCKQUOTE"],
          USE_NATIVE_LINE_BREAK_INSIDE_TAGS = ["LI", "P", "H1", "H2", "H3", "H4", "H5", "H6", "PRE", "BLOCKQUOTE"],
          LIST_TAGS                         = ["UL", "OL", "MENU"];
      
      function adjust(selectedNode) {
        var parentElement = dom.getParentElement(selectedNode, { nodeName: ["P", "DIV"] }, 2);
        if (parentElement) {
          that.selection.executeAndRestore(function() {
            if (that.config.useLineBreaks) {
              dom.replaceWithChildNodes(parentElement);
            } else if (parentElement.nodeName !== "P") {
              dom.renameElement(parentElement, "p");
            }
          });
        }
      }
      
      if (!this.config.useLineBreaks) {
        dom.observe(this.element, ["focus", "keydown"], function() {
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
        });
      }
      
      // Under certain circumstances Chrome + Safari create nested <p> or <hX> tags after paste
      // Inserting an invisible white space in front of it fixes the issue
      if (browser.createsNestedInvalidMarkupAfterPaste()) {
        dom.observe(this.element, "paste", function(event) {
          var invisibleSpace = that.doc.createTextNode(wysihtml5.INVISIBLE_SPACE);
          that.selection.insertNode(invisibleSpace);
        });
      }

      
      dom.observe(this.element, "keydown", function(event) {
        _this.test(event);
        _this.lookForTextSubstituion(event);
        return;

        var keyCode = event.keyCode;
        
        if (event.shiftKey) {
          return;
        }
        
        if (keyCode !== wysihtml5.ENTER_KEY && keyCode !== wysihtml5.BACKSPACE_KEY) {
          return;
        }
        var selectedNode = that.selection.getSelectedNode();
        var blockElement = dom.getParentElement(selectedNode, { 
          nodeName: USE_NATIVE_LINE_BREAK_INSIDE_TAGS 
        }, 4);

        if (blockElement) {
          var list;
          if (blockElement.nodeName === "LI") {
            if (!selectedNode) {
              return;
            }

            list = dom.getParentElement(selectedNode, {
              nodeName: LIST_TAGS
            }, 2);

            if (!list) {
              setTimeout(function() {
                adjust(selectedNode);
              })
            }
          } else if (keyCode === wysihtml5.ENTER_KEY) {
            isBlockElements = BLOCK_ELEMENTS.indexOf(blockElement.nodeName) !== -1
            isSelectedNodeABlockElements = BLOCK_ELEMENTS.indexOf(selectedNode.nodeName) !== -1

            if (isBlockElements && isSelectedNodeABlockElements && !blockElement.textContent) {
              event.preventDefault();
              _this.selection.executeAndRestore(function() {
                dom.renameElement(selectedNode, "p");
              })
            } else if (blockElement.nodeName.match(/^H[1-6]$/)) {
              setTimeout(function() {
                adjust(selectedNode);
              }, 0)
            }
          }
          return;
        }
        
        // if (that.config.useLineBreaks && keyCode === wysihtml5.ENTER_KEY && !wysihtml5.browser.insertsLineBreaksOnReturn()) {
        //   if (!event.defaultPrevented) {
        //     event.preventDefault();
        //     that.commands.exec("insertLineBreak");
        //   }
        // }
      });
    }, 

    _lastInsertedBlock: function(range, e) {
      var nativeRange = range.nativeRange;
      var startContainer = nativeRange.startContainer;
      if (nativeRange.collapsed) {
        e.preventDefault()
        var blockElement = dom.getParentElement(selectedNode, { 
          nodeName: ["LI", "P", "H1", "H2", "H3", "H4", "H5", "H6", "PRE", "BLOCKQUOTE"]; 
        }, 4);

        console.log("LastInsertedBlock: ", nativeRange.cloneRange());
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
        return wordRange;

      }
    },

    lookForTextSubstituion: function(e) {
      if (e.keyCode == wysihtml5.SPACE_KEY) {
        var range = this.selection.getRange();
        var word = this._lastInsertedWordRange(range);
        console.log("Range: '%o' `%s`", word, word.toString());
        for (var i = 0; i < this._textSubstitutions.length; i++) {
          var textSubstitution = this._textSubstitutions[i];

        };
      } else if (e.keyCode == wysihtml5.ENTER_KEY) {
        var range = this.selection.getRange();
        var blockRange = this._lastInsertedBlock(range, e);
        console.log("blockRange: ", blockRange)

      }
    },

    test: function(e) {
      for (var i = 0; i < this._keyboardHandlers.length; i++) {
        var keyboardHandler = this._keyboardHandlers[i];
        if (keyboardHandler.matcher(e)) {
          keyboardHandler.callback(this.editor, this, e);
        }
      };
    }
  });
  wysihtml5.views.Composer.RegisterKeyboardHandler = function(matcher, callback) {
    wysihtml5.views.Composer.prototype._keyboardHandlers.push({
      matcher: matcher, 
      callback: callback
    });
  };

  wysihtml5.views.Composer.RegisterTextSubstitution = function(word, callback) {
    wysihtml5.views.Composer.prototype._textSubstitutions.push({
      word: word,
      callback: callback
    });
  };


})(wysihtml5);
