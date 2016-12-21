import { Composer } from "../views/composer";

var SHORTCUTS = {
  "66": "bold",     // B
  "73": "italic",   // I
  "85": "underline" // U
};

Composer.RegisterKeyboardHandler(function(e) {
  return (
    e.type === "keydown" && SHORTCUTS[e.keyCode] && (e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey
  );
}, function(editor, composer, e) {
  var command = SHORTCUTS[e.keyCode];
  if (command) {
    composer.commands.exec(command);
    e.preventDefault();
  }
});
