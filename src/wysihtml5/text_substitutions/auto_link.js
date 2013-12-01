    // var that                           = this,
    //     supportsDisablingOfAutoLinking = browser.canDisableAutoLinking(),
    //     supportsAutoLinking            = browser.doesAutoLinkingInContentEditable();
    // if (supportsDisablingOfAutoLinking) {
    //   this.commands.exec("autoUrlDetect", false);
    // }

    // if (!this.config.autoLink) {
    //   return;
    // }

    // // Only do the auto linking by ourselves when the browser doesn't support auto linking
    // // OR when he supports auto linking but we were able to turn it off (IE9+)
    // if (!supportsAutoLinking || (supportsAutoLinking && supportsDisablingOfAutoLinking)) {
    //   this.parent.on("newword:composer", function() {
    //     if (dom.getTextContent(that.element).match(dom.autoLink.URL_REG_EXP)) {
    //       that.selection.executeAndRestore(function(startContainer, endContainer) {
    //         dom.autoLink(endContainer.parentNode);
    //       });
    //     }
    //   });
      
    //   dom.observe(this.element, "blur", function() {
    //     dom.autoLink(that.element);
    //   });
    // }

    // // Assuming we have the following:
    // //  <a href="http://www.google.de">http://www.google.de</a>
    // // If a user now changes the url in the innerHTML we want to make sure that
    // // it's synchronized with the href attribute (as long as the innerHTML is still a url)
    // var // Use a live NodeList to check whether there are any links in the document
    //     links           = this.sandbox.getDocument().getElementsByTagName("a"),
    //     // The autoLink helper method reveals a reg exp to detect correct urls
    //     urlRegExp       = dom.autoLink.URL_REG_EXP,
    //     getTextContent  = function(element) {
    //       var textContent = lang.string(dom.getTextContent(element)).trim();
    //       if (textContent.substr(0, 4) === "www.") {
    //         textContent = "http://" + textContent;
    //       }
    //       return textContent;
    //     };

    // dom.observe(this.element, "keydown", function(event) {
    //   if (!links.length) {
    //     return;
    //   }

    //   var selectedNode = that.selection.getSelectedNode(event.target.ownerDocument),
    //       link         = dom.getParentElement(selectedNode, { nodeName: "A" }, 4),
    //       textContent;

    //   if (!link) {
    //     return;
    //   }

    //   textContent = getTextContent(link);
    //   // keydown is fired before the actual content is changed
    //   // therefore we set a timeout to change the href
    //   setTimeout(function() {
    //     var newTextContent = getTextContent(link);
    //     if (newTextContent === textContent) {
    //       return;
    //     }

    //     // Only set href when new href looks like a valid url
    //     if (newTextContent.match(urlRegExp)) {
    //       link.setAttribute("href", newTextContent);
    //     }
    //   }, 0);
    // });
