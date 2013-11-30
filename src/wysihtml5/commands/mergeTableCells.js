import dom from "../dom";

wysihtml5.commands.mergeTableCells = {
  exec: function(composer, command) {
      if (composer.tableSelection && composer.tableSelection.start && composer.tableSelection.end) {
          if (this.state(composer, command)) {
              dom.table.unmergeCell(composer.tableSelection.start);
          } else {
              dom.table.mergeCellsBetween(composer.tableSelection.start, composer.tableSelection.end);
          }
      }
  },

  state: function(composer, command) {
      if (composer.tableSelection) {
          var start = composer.tableSelection.start,
              end = composer.tableSelection.end;
          if (start && end && start == end &&
              ((
                  dom.getAttribute(start, "colspan") &&
                  parseInt(dom.getAttribute(start, "colspan"), 10) > 1
              ) || (
                  dom.getAttribute(start, "rowspan") &&
                  parseInt(dom.getAttribute(start, "rowspan"), 10) > 1
              ))
          ) {
              return [start];
          }
      }
      return false;
  }
};