require "../lib/common"

describe "Clear Inline Block Styles", ->
  describe "collapsed range", ->
    beforeEach ->
      SetupContentEditable(
        "<p>Stringer Bell</p><h2>|Avon Barksdale</h2>",
        "http://localhost:8000/test/integration_tests/html/index_style.html"
      ).then (@editor) =>
        @editor.type(wd.SPECIAL_KEYS["Back space"])

    it "should break header level", ->
      ContentShouldEqual(@editor, "<p>Stringer BellAvon Barksdale</p>")

  describe "lol", ->
    beforeEach ->
      SetupContentEditable(
        "<h2>Avon [Barksdale</h2><p>Stringer] Bell</p>",
        "http://localhost:8000/test/integration_tests/html/index_style.html"
      ).then (@editor) =>
        @editor.type(wd.SPECIAL_KEYS["Back space"])

    it "should break header level?", ->
      ContentShouldEqual(@editor, "<h2>Avon Bell</h2>", true)
