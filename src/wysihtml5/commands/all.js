import { blockquote } from "./blockquote";
import { bold } from "./bold";
import { createLink } from "./createLink";
import { formatBlock } from "./formatBlock";
import { formatInline } from "./formatInline";
import { insertHTML } from "./insertHTML";
import { insertImage } from "./insertImage";
import { insertOrderedList } from "./insertOrderedList";
import { insertUnorderedList } from "./insertUnorderedList";
import { nativeCommand } from "./native_command";
import { italic } from "./italic";
import { redo } from "./redo";
import { underline } from "./underline";
import { undo } from "./undo";
import { pre } from "./pre";

export default = {
  blockquote: blockquote,
  bold: bold,
  createLink: createLink,
  formatBlock: formatBlock,
  formatInline: formatInline,
  insertHTML: insertHTML,
  insertImage: insertImage,
  insertOrderedList: insertOrderedList,
  insertUnorderedList: insertUnorderedList,
  nativeCommand: nativeCommand,
  italic: italic,
  redo: redo,
  underline: underline,
  undo: undo,
  pre: pre
};
