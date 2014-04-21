require "../lib/common"

describe "Prevent empty inherence", ->
  beforeEach ->
    SetupContentEditable("<h2><br></h2><p>|Banana Stand</p>")
      .then (@editor) =>
        @editor.type(wd.SPECIAL_KEYS["Back space"])

  it "should not inherit styles when the previous sibling is empty", ->
    ContentShouldEqual(@editor, "<p>Banana Stand</p>")
