import ListCommand from "./list_command";

var UnorderedListCommand = ListCommand.extend({
  command: "insertUnorderedList",
  tagName: "UL"
})

export default = UnorderedListCommand;
