require "../lib/common"
describe "Preformatted text command", ->
  context "exec", ->
    describe "a feature", ->
      beforeEach ->
        SetupContentEditable([
          "<p>[Stringer Bell]</p>"
        ].join("")).then (@editor) =>
          execCommand("pre")

      it "should convert it into a `pre`", ->
        ContentShouldEqual(@editor, "<pre>Stringer Bell</pre>")

    describe "another feature", ->
      beforeEach ->
        SetupContentEditable([
          "<p>[Stringer Bell</p>",
          "<p>Avon Barksdale]</p>"
        ].join("")).then (@editor) =>
          execCommand("pre")

      it "should convert it into a `pre`", ->
        ContentShouldEqual(@editor, "<pre>Stringer Bell\n\nAvon Barksdale</pre>")

  context "unexec", ->
    describe "a feature", ->
      beforeEach ->
        SetupContentEditable([
          "<pre>Stri[nger B]ell</pre>"
        ].join("")).then (@editor) =>
          execCommand("pre")

      it "should convert it into a `p`", ->
        ContentShouldEqual(@editor, "<p>Stringer Bell</p>")

    describe "another feature", ->
      beforeEach ->
        SetupContentEditable([
          "<pre>[Stringer Bell\n\nAvon Barksdale]</pre>"
        ].join("")).then (@editor) =>
          execCommand("pre")

      it "should convert it into a `p`", ->
        ContentShouldEqual(@editor, """
          <p>Stringer Bell</p>
          <p>Avon Barksdale</p>
        """, true)

    describe "partly unexec", ->
      beforeEach ->
        SetupContentEditable([
          "<pre>[Stringer Be]ll\n\nAvon Barksdale</pre>"
        ].join("")).then (@editor) =>
          execCommand("pre")

      it "should convert it into a `p`", ->
        ContentShouldEqual(@editor, """
          <p>Stringer Bell</p>
          <pre>Avon Barksdale</pre>
        """, true)

    describe "partly unexec 2", ->
      beforeEach ->
        SetupContentEditable([
          "<pre>Stringer Bell\n\n[Avon Barksdale]</pre>"
        ].join("")).then (@editor) =>
          execCommand("pre")

      it "should convert the selected line into a paragraph", ->
        ContentShouldEqual(@editor, """
          <pre>Stringer Bell</pre>
          <p>Avon Barksdale</p>
        """, true)

    describe "partly unexec 3", ->
      beforeEach ->
        SetupContentEditable([
          "<pre>Stringer Bell\n\n[Avon Barksdale]\n\nD’Angelo Barksdale</pre>"
        ].join("")).then (@editor) =>
          execCommand("pre")

      it "should convert the selected line into a paragraph surrounded by `pre`-s", ->
        ContentShouldEqual(@editor, """
          <pre>Stringer Bell</pre>
          <p>Avon Barksdale</p>
          <pre>D’Angelo Barksdale</pre>
        """, true)

    describe "partly unexec 4", ->
      beforeEach ->
        SetupContentEditable([
          "<pre>Stringer Bell\n[Avon Barksdale]\nD’Angelo Barksdale</pre>"
        ].join("")).then (@editor) =>
          execCommand("pre")

      it "should convert the selected line into a paragraph surrounded by `pre`-s", ->
        ContentShouldEqual(@editor, """
          <pre>Stringer Bell</pre>
          <p>Avon Barksdale</p>
          <pre>D’Angelo Barksdale</pre>
        """, true)
