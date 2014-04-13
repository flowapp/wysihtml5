var insertHTML = {
  exec: function(composer, command, html) {
    if (composer.commands.support(command)) {
      document.execCommand(command, false, html);
    } else {
      composer.selection.insertHTML(html);
    }
  },

  state: function() {
    return false;
  }
};

export { insertHTML };
