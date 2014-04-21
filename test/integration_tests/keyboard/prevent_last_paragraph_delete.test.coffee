require "../lib/common"

describe "Prevent Last Paragraph from being deleted", ->
  beforeEach ->
    SetupContentEditable("<p>|<br></p>")
      .then (@editor) =>
        @editor.type(wd.SPECIAL_KEYS["Back space"])

  it "should not inherit styles when the previous sibling is empty", ->
    ContentShouldEqual(@editor, "<p><br></p>")
