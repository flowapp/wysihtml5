import { cleanPastedHTML } from "./quirks/clean_pasted_html";
import { ensureProperClearing } from "./quirks/ensure_proper_clearing";
import { getCorrectInnerHTML } from "./quirks/get_correct_inner_html";
import { redraw } from "./quirks/redraw";

export default {
  cleanPastedHTML: cleanPastedHTML,
  ensureProperClearing: ensureProperClearing,
  getCorrectInnerHTML: getCorrectInnerHTML,
  redraw: redraw,
};
