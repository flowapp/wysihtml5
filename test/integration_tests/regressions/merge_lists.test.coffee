require "../lib/common"

# Converting

describe.skip "Regression: correctly merging lists when re-applying list command", ->
  context "ordered list", ->
    beforeEach ->
      SetupContentEditable([
        "<ol><li>Avon Barksdale</li></ol>"
        "<ul><li>Str[inger Be]ll</li></ul>"
        "<ol><li>D’Angelo Barksdale</li></ol>"
      ].join("")).then (@editor) =>
        execCommand("insertOrderedList")

    it "should merge lists when converting from unordered list into an ordered list", ->
      ContentShouldEqual(@editor, """
        <ol>
          <li>Avon Barksdale</li>
          <li>Stringer Bell</li>
          <li>D’Angelo Barksdale</li>
        </ol>
      """)

  context "unordered list", ->
    beforeEach ->
      SetupContentEditable([
        "<ul><li>Avon Barksdale</li></ul>"
        "<ol><li>Str[inger Be]ll</li></ol>"
        "<ul><li>D’Angelo Barksdale</li></ul>"
      ].join("")).then (@editor) =>
        execCommand("insertOrderedList")

    it "should merge lists when converting from ordered list into an unordered list", ->
      ContentShouldEqual(@editor, """
        <ul>
          <li>Avon Barksdale</li>
          <li>Stringer Bell</li>
          <li>D’Angelo Barksdale</li>
        </ul>
      """)
