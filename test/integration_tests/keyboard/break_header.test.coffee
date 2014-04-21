require "../lib/common"
wait = require "../lib/wait"

describe "Break Header", ->
  [1, 2, 3, 4, 5 ,6].forEach (index) =>
    context "<h#{index}>", ->
      beforeEach ->
        SetupContentEditable("<h#{index}>Banana stand|</h#{index}>")
          .then (@editor) =>
            @editor.type(wd.SPECIAL_KEYS["Return"])

      it "should break header level #{index}", ->
        ContentShouldEqual(@editor, "<h#{index}>Banana stand</h#{index}><p><br></p>")
