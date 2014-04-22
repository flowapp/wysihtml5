/**
 * @license wysihtml5x v@@version
 * @@repo
 *
 * Author: Christopher Blum (https://github.com/tiff)
 * Secondary author of extended features: Oliver Pulges (https://github.com/pulges)
 *
 * Copyright (C) 2012 XING AG
 * Licensed under the MIT license (MIT)
 */

import dom from "wysihtml5/dom";
import lang from "wysihtml5/lang";
import { Editor } from "wysihtml5/editor";

// Composer
import { Composer } from "wysihtml5/views/composer";
import "wysihtml5/views/composer_observer";
import "wysihtml5/views/composer_selection_event";

// Keyboard fixes
import "wysihtml5/keyboard/list_merger";
import "wysihtml5/keyboard/prevent_last_paragraph_delete";
import "wysihtml5/keyboard/prevent_empty_inherence";
import "wysihtml5/keyboard/clear_inline_block_style";
import "wysihtml5/keyboard/newline_pre";
import "wysihtml5/keyboard/break_block_elements";
import "wysihtml5/keyboard/contenteditable_delete";
import "wysihtml5/keyboard/break_header";
import "wysihtml5/keyboard/break_list";
import "wysihtml5/keyboard/shortcuts";
import "wysihtml5/keyboard/delete_images";
import "wysihtml5/keyboard/delete_block_elements";

// Text Substitutions
import "wysihtml5/text_substitutions/auto_link";
import "wysihtml5/text_substitutions/auto_list";
import "wysihtml5/text_substitutions/blockquote";
import "wysihtml5/text_substitutions/ticks";

var version = "@@version";

export { version, Editor, Composer, lang, dom};
