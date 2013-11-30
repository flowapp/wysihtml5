import { addTableCells } from "./addTableCells";
import { bgColorStyle } from "./bgColorStyle";
import { bold } from "./bold";
import { createLink } from "./createLink";
// import { createTable } from "./createTable";
// import { deleteTableCells } from "./deleteTableCells";
import { fontSize } from "./fontSize";
// import { foreColor } from "./foreColor";
// import { foreColorStyle } from "./foreColorStyle";
import { formatBlock } from "./formatBlock";
import { formatInline } from "./formatInline";
import { insertHTML } from "./insertHTML";
import { insertImage } from "./insertImage";
// import { insertLineBreak } from "./insertLineBreak";
import { insertOrderedList } from "./insertOrderedList";
import { insertUnorderedList } from "./insertUnorderedList";
import { italic } from "./italic";
// import { justifyCenter } from "./justifyCenter";
// import { justifyFull } from "./justifyFull";
// import { justifyLeft } from "./justifyLeft";
// import { justifyRight } from "./justifyRight";
// import { mergeTableCells } from "./mergeTableCells";
import { redo } from "./redo";
import { underline } from "./underline";
import { undo } from "./undo";

export default = {
  addTableCells: addTableCells,
  bgColorStyle: bgColorStyle,
  bold: bold,
  createLink: createLink,
  fontSize: fontSize,
  formatBlock: formatBlock,
  formatInline: formatInline,
  insertHTML: insertHTML,
  insertImage: insertImage,
  insertOrderedList: insertOrderedList,
  insertUnorderedList: insertUnorderedList,
  italic: italic,
  redo: redo,
  underline: underline,
  undo: undo
};