require "../lib/common"

describe "Ticks", ->
  beforeEach ->
    SetupContentEditable("<p>|Stringer Bell</p>")
      .then (@editor) =>
        @editor.type("``` ")

  it "should covert paragraph into a `pre` when typing ticks", ->
    ContentShouldEqual(@editor, """
      <pre>Stringer Bell</pre>
    """)
