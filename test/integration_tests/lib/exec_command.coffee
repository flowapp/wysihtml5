module.exports = (args...) ->
  browser.execute("""
    var commands = window.editor.composer.commands;
    return commands.exec.apply(commands, arguments);
  """, args)
