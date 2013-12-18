var nativeCommand = {
  exec: function(composer, command) {
    var entireRange = composer.selection.getRange();
    var ranges = composer.selection.getOwnRanges();
    if (ranges.length) {
      ranges.forEach(function(range) {
        composer.selection.setSelection(range);
        document.execCommand(command, false, null);
      });
      if (!entireRange.collapsed && ranges.length > 1) {
        var range = document.createRange()
        range.setStart(entireRange.startContainer, entireRange.startOffset);
        range.setEnd(entireRange.endContainer, entireRange.endOffset);
        composer.selection.setSelection(range);
      }
    }
  }
};

export { nativeCommand };
