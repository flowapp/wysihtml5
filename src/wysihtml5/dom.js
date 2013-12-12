import { addClass, removeClass, hasClass } from "wysihtml5/dom/class";
import { contains } from "wysihtml5/dom/contains";
import { convertToList } from "wysihtml5/dom/convert_to_list";
import { copyAttributes } from "wysihtml5/dom/copy_attributes";
import { copyStyles } from "wysihtml5/dom/copy_styles";
import { delegate } from "wysihtml5/dom/delegate";
import { getAsDom } from "wysihtml5/dom/get_as_dom";
import { getAttribute } from "wysihtml5/dom/get_attribute";
import { getParentElement } from "wysihtml5/dom/get_parent_element";
import { getStyle } from "wysihtml5/dom/get_style";
import { hasElementWithClassName } from "wysihtml5/dom/has_element_with_class_name";
import { hasElementWithTagName } from "wysihtml5/dom/has_element_with_tag_name";
import { insertCSS } from "wysihtml5/dom/insert_css";
import { insert } from "wysihtml5/dom/insert";
import { observe } from "wysihtml5/dom/observe";
import { Parser } from "wysihtml5/dom/parse";
import { query } from "wysihtml5/dom/query";
import { reblock } from "wysihtml5/dom/reblock";
import { removeEmptyTextNodes } from "wysihtml5/dom/remove_empty_text_nodes";
import { removeEmptyNodes } from "wysihtml5/dom/remove_empty_nodes";
import { renameElement } from "wysihtml5/dom/rename_element";
import { replaceWithChildNodes } from "wysihtml5/dom/replace_with_child_nodes";
import { resolveList } from "wysihtml5/dom/resolve_list";
import { setAttributes } from "wysihtml5/dom/set_attributes";
import { setStyles } from "wysihtml5/dom/set_styles";
//import { table } from "wysihtml5/dom/table";
import { setTextContent, getTextContent } from "wysihtml5/dom/text_content";

export default = {
  addClass: addClass,
  removeClass: removeClass,
  hasClass: hasClass,
  contains: contains,
  convertToList: convertToList,
  copyAttributes: copyAttributes,
  copyStyles: copyStyles,
  delegate: delegate,
  getAsDom: getAsDom,
  getAttribute: getAttribute,
  getParentElement: getParentElement,
  getStyle: getStyle,
  hasElementWithClassName: hasElementWithClassName,
  hasElementWithTagName: hasElementWithTagName,
  insertCSS: insertCSS,
  insert: insert,
  observe: observe,
  Parser: Parser,
  query: query,
  reblock: reblock,
  removeEmptyTextNodes: removeEmptyTextNodes,
  removeEmptyNodes: removeEmptyNodes,
  renameElement: renameElement,
  replaceWithChildNodes: replaceWithChildNodes,
  resolveList: resolveList,
  setAttributes: setAttributes,
  setStyles: setStyles,
  //table: table,
  setTextContent: setTextContent,
  getTextContent: getTextContent
};
