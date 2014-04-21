require "../lib/common"

describe "Blackquote keyboard handler", ->
  context "creating blockquote", ->
    beforeEach ->
      SetupContentEditable().then (@editor) =>
        @editor.type("> banana")

    it "should create blackquote by committing `>`", ->
      ContentShouldEqual(@editor, "<blockquote><p>banana</p></blockquote>")

  context "not creating blockquote", ->
    beforeEach ->
      SetupContentEditable().then (@editor) =>
        @editor.type("banana > apple")

    it "should only create blackquote by committing `>` at the start of the paragraph", ->
      ContentShouldEqual(@editor, "<p>banana &gt; apple<br></p>")

  context "disabled inside blockquote", ->
    beforeEach ->
      SetupContentEditable("<blockquote><p>|stand</p></blockquote>")
        .then (@editor) =>
          @editor.type("> banana ")

    it "should not create blockquote inside of a blockquote", ->
      ContentShouldEqual(@editor, """
        <blockquote>
          <p>&gt; banana stand</p>
        </blockquote>
      """)
