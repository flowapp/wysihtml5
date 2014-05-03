RSVP = require("rsvp")
SetupContentEditable = require("./setup_content_editable")
ContentShouldEqual = require("./content")

fakePaste = require "./fake_paste"

execCommand = require "./exec_command"

class Editor
  constructor: (init) ->
    @_deferred = RSVP.defer()
    setTimeout()
    @promise = @_deferred.promise
    SetupContentEditable(init).then (@_editor) =>
      @_deferred.resolve()
      undefined

    this

  shouldEqual: (content, debug) ->
    ContentShouldEqual(@_editor, content, debug)

  then: (resolve, reject) ->
    @_deferred.promise.then(resolve, reject)

module.exports = Editor
