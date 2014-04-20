var CommandStates = {
  CommandStateNotApplied: 0,
  CommandStateFullyApplied: 1,
  CommandStatePartiallyApplied: 2,
};

var ALIAS_MAPPING = {
  strong: "B",
  em: "I",
  b: "STRONG",
  i: "EM"
};

var Command = Base.extend({
  constructor: function(composer) {
    this.composer = composer;
  },

  exec: function() {

  },

  unexec: function() {

  },

  state: function() {

  },

  shouldUnapplyForCommand: function(command) {
    return true;
  },

  nodeName: function(nodeName) {
    var nodeNames = Array.isArray(nodeName) ? nodeName.slice(0) : [nodeName]
    if (ALIAS_MAPPING[nodeName]) {
      nodeNames.push(ALIAS_MAPPING[nodeName]);
    }
    var ranges = this.composer.selection.getOwnRanges();
    return this.nodeNameAppliedInRanges(nodeNames, ranges).length !== 0
  },

  nodeNameAppliedInRanges: function(nodeName, ranges) {
    var ancestors = [];
    for (var rangeIndex = ranges.length; rangeIndex--;) {
      var range = ranges[rangeIndex];
      var textNodes = range.getNodes([Node.TEXT_NODE]);
      if (!textNodes.length) {
        var ancestor = this.composer.parentElement(range.startContainer, {
          nodeName: nodeName
        });
        if (ancestor) {
          ancestors.push(ancestor);
        }
        continue
      }

      for (var textIndex = 0, length = textNodes.length; textIndex < length; textIndex++) {
        var textNode = textNodes[textIndex];
        var selectedText = this._getTextSelectedByRange(textNode, range);

        var ancestor = this.composer.parentElement(textNode, {
          nodeName: nodeName
        });


        if (ancestor && selectedText.length) {
          ancestors.push(ancestor);
        }
      }
    }
    return ancestors;
  },

  _getTextSelectedByRange: function(textNode, range) {
    var textRange = range.cloneRange();
    textRange.selectNodeContents(textNode);

    var intersectionRange = textRange.intersection(range);
    var text = intersectionRange ? intersectionRange.toString() : "";
    textRange.detach();

    return text;
  },


});
Command.CommandStates = CommandStates;

export { Command, CommandStates };
