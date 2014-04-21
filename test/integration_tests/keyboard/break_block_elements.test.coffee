require "../lib/common"

describe "Break Block Elements", ->
  describe "Blockquotes", ->
    beforeEach ->
      SetupContentEditable("<blockquote><p>banana</p><p>|<br></p></blockquote>")
        .then (@editor) =>
          @editor.type(wd.SPECIAL_KEYS["Return"])

    it "should break out of empty paragraphs inside blockquote", ->
      ContentShouldEqual(@editor, """
        <blockquote>
          <p>banana</p>
        </blockquote>
        <p><br></p>
      """)

  describe "Blockquotes", ->
    beforeEach ->
      SetupContentEditable("<blockquote><p>banana|</p></blockquote>")
        .then (@editor) =>
          @editor.type(wd.SPECIAL_KEYS["Return"])

    it "should only break out if it’s empty", ->
      ContentShouldEqual(@editor, """
        <blockquote>
          <p>banana</p>
          <p><br></p>
        </blockquote>
      """)
