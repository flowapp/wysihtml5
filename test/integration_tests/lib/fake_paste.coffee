module.exports = {
  text: (text) ->
    browser.execute("window.editor.composer.handlePastedPlainText(arguments[0]);", [text])
  html: (html) ->
    browser.execute("window.editor.composer.handlePastedHTML(arguments[0]);", [html])
}
