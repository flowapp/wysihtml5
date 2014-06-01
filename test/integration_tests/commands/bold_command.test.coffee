require "../lib/common"

describe "Bold command", ->
  context "#exec", ->
    describe "fully selecting a node", ->
      it "should convert the paragraph into a header", ->
        SetupContentEditable("<p>[Stringer Bell]</p>")
          .then (@editor) =>
            execCommand("bold")
          .then =>
            ContentShouldEqual(@editor, """
              <p><b>Stringer Bell</b></p>
            """)

    describe "partly selecting a node", ->
      it "should convert the selection into a bold element", ->
        SetupContentEditable("<p>Stringer B[ell]</p>")
          .then (@editor) =>
            execCommand("bold")
          .then =>
            ContentShouldEqual(@editor, """
              <p>Stringer B<b>ell</b></p>
            """)

    describe "selecting text node with sibling bold elements", ->
      it "should merge with the sibling bold element", ->
        SetupContentEditable("<p><b>Stringer B</b>[ell]</p>")
          .then (@editor) =>
            execCommand("bold")
          .then =>
            ContentShouldEqual(@editor, """
              <p><b>Stringer Bell</b></p>
            """)

      it "should merge with the sibling bold element", ->
        SetupContentEditable("<p>[String]<b>er Bell</b></p>")
          .then (@editor) =>
            execCommand("bold")
          .then =>
            ContentShouldEqual(@editor, """
              <p><b>Stringer Bell</b></p>
            """)

      it "should merge with the sibling bold element", ->
        SetupContentEditable("<p><b>Str</b>[ing]<b>er Bell</b></p>")
          .then (@editor) =>
            execCommand("bold")
          .then =>
            ContentShouldEqual(@editor, """
              <p><b>Stringer Bell</b></p>
            """)


    describe "selection spanning over multiple block elements", ->
      it "should insert bold elements in all block elements", ->
        SetupContentEditable("<p>[Stringer Bell</p><p>Avon Barksdale]</p>")
          .then (@editor) =>
            execCommand("bold")
          .then =>
            ContentShouldEqual(@editor, """
              <p><b>Stringer Bell</b></p><p><b>Avon Barksdale</b></p>
            """)

      it "should partially apply bold elements", ->
        SetupContentEditable("<p>Stringer [Bell</p><p>Avon] Barksdale</p>")
          .then (@editor) =>
            execCommand("bold")
          .then =>
            ContentShouldEqual(@editor, """
              <p>Stringer <b>Bell</b></p><p><b>Avon</b> Barksdale</p>
            """)

      it "should partially apply bold elements", ->
        SetupContentEditable("<p>Stringer [Bell</p><p>D’Angelo Barksdale</p><p>Avon] Barksdale</p>")
          .then (@editor) =>
            execCommand("bold")
          .then =>
            ContentShouldEqual(@editor, """
              <p>Stringer <b>Bell</b></p><p><b>D’Angelo Barksdale</b></p><p><b>Avon</b> Barksdale</p>
            """)

  describe "BoldCommand#unexec", ->
    describe "fully selected node", ->
      it "should unapply bold ", ->
        SetupContentEditable("<p><b>[Stringer Bell]</b></p>")
          .then (@editor) =>
            execCommand("bold")
          .then =>
            ContentShouldEqual(@editor, """
              <p>Stringer Bell</p>
            """)

    describe "fully selected node", ->
      it "should convert the paragraph into a header", ->
        SetupContentEditable("<p>[<b>Stringer Bell</b>]</p>")
          .then (@editor) =>
            execCommand("bold")
          .then =>
            ContentShouldEqual(@editor, """
              <p>Stringer Bell</p>
            """)

    describe "partly selected node", ->
      it "should convert the selection into a bold element", ->
        SetupContentEditable("<p>Stringer [B<b>ell]</b></p>")
          .then (@editor) =>
            execCommand("bold")
          .then =>
            ContentShouldEqual(@editor, """
              <p>Stringer <b>Bell</b></p>
            """)

    describe "selecting text node that’s the next sibling to a bold element", ->
      it "should convert the selection into a bold element", ->
        SetupContentEditable("<p>Stringer <b>B[ell]</b></p>")
          .then (@editor) =>
            execCommand("bold")
          .then =>
            ContentShouldEqual(@editor, """
              <p>Stringer <b>B</b>ell</p>
            """)
