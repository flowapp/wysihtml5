var undo = {
  exec: function(composer) {
    return composer.undoManager.undo();
  },

  state: function(composer) {
    return false;
  }
};

export { undo };