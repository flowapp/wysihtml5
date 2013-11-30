var redo = {
  exec: function(composer) {
    return composer.undoManager.redo();
  },

  state: function(composer) {
    return false;
  }
};

export { redo };