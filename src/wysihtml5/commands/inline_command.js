import { Command, CommandStates } from "./command";
import PreCommand from "./pre_command";

var InlineCommand = Command.extend({
  // Inline commands are disabled in pre by default.
  enabledInCommand: function(klass) {
    if (klass instanceof PreCommand) {
      return false;
    }
    return true;
  }
});
InlineCommand.CommandStates = CommandStates;

export { InlineCommand };
