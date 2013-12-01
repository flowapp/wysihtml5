/**
 * @license wysihtml5x v<%= pkg.version %>
 * https://github.com/Edicy/wysihtml5
 *
 * Author: Christopher Blum (https://github.com/tiff)
 * Secondary author of extended features: Oliver Pulges (https://github.com/pulges)
 *
 * Copyright (C) 2012 XING AG
 * Licensed under the MIT license (MIT)
 *
 */

import dom from "wysihtml5/dom";
import lang from "wysihtml5/lang";
import { Editor } from "wysihtml5/editor";
import { Composer } from "wysihtml5/views/composer";
import "wysihtml5/views/composer_observer";

// Keyboard fixes
import "wysihtml5/keyboard/break_block_elements";
import "wysihtml5/keyboard/list_element_delete";
import "wysihtml5/keyboard/break_header";
import "wysihtml5/keyboard/break_list";

var version = "<%= pkg.version %>";

var wysihtml5 = {
  // namespaces
  commands:   {},
  quirks:     {},
  selection:  {},
  views:      {},
};

export { version, Editor, lang, dom};
