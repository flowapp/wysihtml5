import { all } from "wysihtml5/dom/all";
import { appendChildNodes } from "wysihtml5/dom/append_child_nodes";
import { contains } from "wysihtml5/dom/contains";
import { copyAttributes } from "wysihtml5/dom/copy_attributes";
import { copyStyles } from "wysihtml5/dom/copy_styles";
import { getAsDom } from "wysihtml5/dom/get_as_dom";
import { getParentElement } from "wysihtml5/dom/get_parent_element";
import { getStyle } from "wysihtml5/dom/get_style";
import { hasElementWithClassName } from "wysihtml5/dom/has_element_with_class_name";
import { hasElementWithTagName } from "wysihtml5/dom/has_element_with_tag_name";
import { insert } from "wysihtml5/dom/insert";
import { normalize } from "./dom/normalize";
import { observe } from "wysihtml5/dom/observe";
import { Parser } from "wysihtml5/dom/parse";
import { query } from "wysihtml5/dom/query";
import { reblock } from "wysihtml5/dom/reblock";
import { removeEmptyTextNodes } from "wysihtml5/dom/remove_empty_text_nodes";
import { removeEmptyNodes } from "wysihtml5/dom/remove_empty_nodes";
import { removeTrailingLineBreaks } from "wysihtml5/dom/remove_trailing_line_breaks";
import { renameElement } from "wysihtml5/dom/rename_element";
import { replaceWithChildNodes } from "wysihtml5/dom/replace_with_child_nodes";
import { setAttributes } from "wysihtml5/dom/set_attributes";
import { nodeList } from "wysihtml5/dom/node_list";
import { setTextContent, getTextContent } from "wysihtml5/dom/text_content";

export default = {
  all: all,
  appendChildNodes: appendChildNodes,
  contains: contains,
  copyAttributes: copyAttributes,
  copyStyles: copyStyles,
  getAsDom: getAsDom,
  getParentElement: getParentElement,
  getStyle: getStyle,
  hasElementWithClassName: hasElementWithClassName,
  hasElementWithTagName: hasElementWithTagName,
  insert: insert,
  normalize: normalize,
  observe: observe,
  Parser: Parser,
  query: query,
  reblock: reblock,
  removeEmptyTextNodes: removeEmptyTextNodes,
  removeEmptyNodes: removeEmptyNodes,
  removeTrailingLineBreaks: removeTrailingLineBreaks,
  renameElement: renameElement,
  replaceWithChildNodes: replaceWithChildNodes,
  setAttributes: setAttributes,
  nodeList: nodeList,
  setTextContent: setTextContent,
  getTextContent: getTextContent
};
