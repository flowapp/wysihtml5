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
import { Commands } from "wysihtml5/commands";

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


// Commands (move this…)
import PreCommand from "wysihtml5/commands/pre_command";
import BlockquoteCommand from "wysihtml5/commands/blockquote_command";
import BoldCommand from "wysihtml5/commands/bold_command";
import ItalicCommand from "wysihtml5/commands/italic_command";
import UnderlineCommand from "wysihtml5/commands/underline_command";
import LinkCommand from "wysihtml5/commands/link_command";
import UnorderedListCommand from "wysihtml5/commands/unordered_list_command";
import OrderedListCommand from "wysihtml5/commands/ordered_list_command";
import ParagraphCommand from "wysihtml5/commands/paragraph_command";
import HeaderCommand from "wysihtml5/commands/header_command";

// Inline elements
Commands.RegisterCommand("bold", BoldCommand);
Commands.RegisterCommand("italic", ItalicCommand);
Commands.RegisterCommand("underline", UnderlineCommand);
Commands.RegisterCommand("createLink", LinkCommand);
Commands.RegisterCommand("insertUnorderedList", UnorderedListCommand);
Commands.RegisterCommand("insertOrderedList", OrderedListCommand);

// Block elements
Commands.RegisterCommand("pre", PreCommand);
Commands.RegisterCommand("blockquote", BlockquoteCommand);
Commands.RegisterCommand("paragraph", ParagraphCommand);
Commands.RegisterCommand("header", HeaderCommand);

// Text Substitutions
import "wysihtml5/text_substitutions/auto_link";
import "wysihtml5/text_substitutions/auto_list";
import "wysihtml5/text_substitutions/blockquote";
import "wysihtml5/text_substitutions/ticks";

var version = "@@version";

export { version, Editor, Composer, lang, dom};
