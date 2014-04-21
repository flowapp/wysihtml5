require "../lib/common"

describe.skip "Clear Inline Block Styles", ->
  beforeEach ->
    SetupContentEditable(
      "<p>Stringer Bell</p><h2>|Avon Barksdale</h2>",
      "http://localhost:8000/test/integration_tests/html/index_style.html"
    ).then (@editor) =>
      @editor.type(wd.SPECIAL_KEYS["Back space"])

  it "should break header level", ->
    ContentShouldEqual(@editor, "<p>Stringer Bell<span>Avon Barksdale</span></p>")
