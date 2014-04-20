/**
 * Rich Text Query/Formatting Commands
 *
 * @example
 *    var commands = new wysihtml5.Commands(editor);
 */

import { browser } from "./browser";
import commands from "./commands_deprecated/all";

import { BlockCommand } from "./commands/block_command";
import { InlineCommand } from "./commands/inline_command";

import lang from "./lang";

var Commands = Base.extend({
  _commandsKlasses: [],

  constructor: function(editor, composer) {
    this.editor = editor;
    this.composer = composer;
    this.doc = document; // Deprecated

    this.commands = {};
    this.commandList = this._commandsKlasses.map(function(item) {
      var klass = new item.klass(composer);
      this.commands[item.command] = klass;
      return klass;
    }.bind(this));
  },

  /**
   * Check whether the browser supports the given command
   *
   * @param {String} command The command string which to check (eg. "bold", "italic", "insertUnorderedList")
   * @example
   *    commands.supports("createLink");
   */
  support: function(command) {
    return browser.supportsCommand(document, command);
  },

  /**
   * Check whether the browser supports the given command
   *
   * @param {String} command The command string which to execute (eg. "bold", "italic", "insertUnorderedList")
   * @param {String} [value] The command value parameter, needed for some commands ("createLink", "insertImage", ...), optional for commands that don't require one ("bold", "underline", ...)
   * @example
   *    commands.exec("insertImage", "http://a1.twimg.com/profile_images/113868655/schrei_twitter_reasonably_small.jpg");
   */
  exec: function(command, value) {
    var obj = commands[command];
    var args = lang.array(arguments).get();
    var method = obj && obj.exec;
    var result = null;

    // Deprecated
    if (!this.commands[command]) {
      if (this.state("formatInline", "pre")) {
        var blockedCommands = ["formatInline", "formatBlock", "bold", "italic", "insertUnorderedList", "insertOrderedList"]
        if (blockedCommands.indexOf(command) != -1 && value != "pre") {
          return false;
        }
      }
    }

    this.editor.fire("beforecommand:composer");
    if (this.commands[command]) {
      result = this._runCommand(command, value);
    } else if (method) { // Deprecated
      args.unshift(this.composer);
      result = method.apply(obj, args);
    } else {
      try {
        // try/catch for buggy firefox
        result = document.execCommand(command, false, value);
      } catch(e) {}
    }

    this.editor.fire("aftercommand:composer");
    return result;
  },

  /**
   * Check whether the current command is active
   * If the caret is within a bold text, then calling this with command "bold" should return true
   *
   * @param {String} command The command string which to check (eg. "bold", "italic", "insertUnorderedList")
   * @param {String} [commandValue] The command value parameter (eg. for "insertImage" the image src)
   * @return {Boolean} Whether the command is active
   * @example
   *    var isCurrentSelectionBold = commands.state("bold");
   */
  state: function(command, commandValue) {
    var obj = commands[command];
    var args = lang.array(arguments).get();
    var method = obj && obj.state;

    if (this.commands[command]) {
      return this.commands[command].state(commandValue);
    } else if (method) {
      // Deprecated
      args.unshift(this.composer);
      return method.apply(obj, args);
    } else {
      try {
        // try/catch for buggy firefox
        return document.queryCommandState(command);
      } catch(e) {
        return false;
      }
    }
  },

  //
  // Private
  //

  _runCommand: function(command, value) {
    var klass = this.commands[command];
    if (klass.state(value)) {
      klass.unexec(value);
    } else {
      this._unapply(klass);
      return klass.exec(value);
    }
  },

  _unapply: function(aboutToApplyCommand) {
    if (aboutToApplyCommand instanceof BlockCommand) {
      this.commandList.forEach(function(command) {
        if (command instanceof InlineCommand) {
          if (!command.enabledInCommand(aboutToApplyCommand)) {
            if (command.state()) {
              command.unexec();
            }
          }
        } else if (command instanceof BlockCommand) {
          if (command != aboutToApplyCommand) {
            if (command.shouldUnapplyForCommand(aboutToApplyCommand)) {
              if (command.state()) {
                command.unexec();
              }
            }
          }
        }
      });
    }
  },

  _exec: function(command) {
    this.commands[command].exec();
  },

  _unexec: function() {
    this.commands[command].unexec();
  }

});

Commands.RegisterCommand = function(command, klass) {
  Commands.prototype._commandsKlasses.push({
    command: command,
    klass: klass
  })
};

export { Commands };
