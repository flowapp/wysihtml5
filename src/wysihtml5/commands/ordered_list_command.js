import ListCommand from "./list_command";

var OrderedListCommand = ListCommand.extend({
  command: "insertOrderedList",
  tagName: "OL"
})

export default = OrderedListCommand;
