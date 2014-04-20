require "../lib/common"

# Make sure the omposer doesn’t consider empty block elements as empty and make
# sure there is a paragraph element

describe "Regression: prevent ensure paragraph from prematurely clearing", ->
  beforeEach ->
    SetupContentEditable("<blockquote><p>b|<br></p></blockquote>")
      .then (@editor) =>
        @editor.type(wd.SPECIAL_KEYS["Back space"])

  it "shouldn’t clear composer when it’s visually empty, but contains visual block elements", ->
    ContentShouldEqual(@editor, """
      <blockquote>
        <p><br></p>
      </blockquote>
    """)
