require "../lib/common"
describe "Blockquote command", ->
  context "exec", ->
    describe "fully selected paragraph", ->
      beforeEach ->
        SetupContentEditable([
          "<p>[Stringer Bell]</p>"
        ].join("")).then (@editor) =>
          execCommand("blockquote")

      it "should wrap the paragraph in a blockquote", ->
        ContentShouldEqual(@editor, """
          <blockquote>
            <p>Stringer Bell</p>
          </blockquote>
        """)

    describe "collpased selection inside paragraph", ->
      beforeEach ->
        SetupContentEditable([
          "<p>String|er Bell</p>"
        ].join("")).then (@editor) =>
          execCommand("blockquote")

      it "should wrap the paragraph in a blockquote", ->
        ContentShouldEqual(@editor, """
          <blockquote>
            <p>Stringer Bell</p>
          </blockquote>
        """)

    describe "collpased selection inside an empty paragraph", ->
      beforeEach ->
        SetupContentEditable([
          "<p>|<br></p>"
        ].join("")).then (@editor) =>
          execCommand("blockquote")

      it "should wrap the paragraph in a blockquote", ->
        ContentShouldEqual(@editor, """
          <blockquote>
            <p><br></p>
          </blockquote>
        """)

    describe "selection spanning over two paragraphs", ->
      beforeEach ->
        SetupContentEditable([
          "<p>Strin[ger Bell</p>",
          "<p>Avon Barks]dale</p>"
        ].join("")).then (@editor) =>
          execCommand("blockquote")

      it "should be wrapped inside a blockquote", ->
        ContentShouldEqual(@editor, """
          <blockquote>
            <p>Stringer Bell</p>
            <p>Avon Barksdale</p>
          </blockquote>
        """)

    describe "selected paragraph with next sibling being a blockquote", ->
      beforeEach ->
        SetupContentEditable([
          "<p>Strin[ger Be]ll</p>",
          "<blockquote>"
          "<p>Avon Barksdale</p>"
          "</blockquote>"
        ].join("")).then (@editor) =>
          execCommand("blockquote")

      it "should add the paragraph into the blockquote", ->
        ContentShouldEqual(@editor, """
          <blockquote>
            <p>Stringer Bell</p>
            <p>Avon Barksdale</p>
          </blockquote>
        """)

    describe "selected paragraph with previous sibling being a blockquote", ->
      beforeEach ->
        SetupContentEditable([
          "<blockquote>"
          "<p>Avon Barksdale</p>"
          "</blockquote>"
          "<p>Strin[ger Be]ll</p>"
        ].join("")).then (@editor) =>
          execCommand("blockquote")

      it "should add the paragraph into the blockquote", ->
        ContentShouldEqual(@editor, """
          <blockquote>
            <p>Avon Barksdale</p>
            <p>Stringer Bell</p>
          </blockquote>
        """)

    describe "selected paragraph with surrounded by blockquotes", ->
      beforeEach ->
        SetupContentEditable([
          "<blockquote>"
          "<p>Avon Barksdale</p>"
          "</blockquote>"
          "<p>Strin[ger Be]ll</p>"
          "<blockquote>"
          "<p>D’Angelo Barksdale</p>"
          "</blockquote>"

        ].join("")).then (@editor) =>
          execCommand("blockquote")

      it "should add the paragrap and merge the other blockquote into it", ->
        ContentShouldEqual(@editor, """
          <blockquote>
            <p>Avon Barksdale</p>
            <p>Stringer Bell</p>
            <p>D’Angelo Barksdale</p>
          </blockquote>
        """)

  context "unexec", ->
    describe "fully selected paragraph in a blockquote", ->
      beforeEach ->
        SetupContentEditable([
          "<blockquote>"
          "<p>[Stringer Bell]</p>"
          "</blockquote>"
        ].join("")).then (@editor) =>
          execCommand("blockquote")

      it "should wrap the paragraph in a blockquote", ->
        ContentShouldEqual(@editor, """
          <p>Stringer Bell</p>
        """)

    describe "collapsed selection inside a paragraph in a blockquote", ->
      beforeEach ->
        SetupContentEditable([
          "<blockquote>"
          "<p>Stringe|r Bell</p>"
          "</blockquote>"
        ].join("")).then (@editor) =>
          execCommand("blockquote")

      it "should wrap the paragraph in a blockquote", ->
        ContentShouldEqual(@editor, """
          <p>Stringer Bell</p>
        """)

    describe "collapsed selection inside an empty paragraph in a blockquote", ->
      beforeEach ->
        SetupContentEditable([
          "<blockquote>"
          "<p>|<br></p>"
          "</blockquote>"
        ].join("")).then (@editor) =>
          execCommand("blockquote")

      it "should wrap the paragraph in a blockquote", ->
        ContentShouldEqual(@editor, """
          <p><br></p>
        """)

    describe "selection spanning over two paragraphs inside a blockquote", ->
      beforeEach ->
        SetupContentEditable([
          "<blockquote>"
          "<p>Strin[ger Bell</p>"
          "<p>Avon Barks]dale</p>"
          "</blockquote>"
        ].join("")).then (@editor) =>
          execCommand("blockquote")

      it "should be wrapped inside a blockquote", ->
        ContentShouldEqual(@editor, """
          <p>Stringer Bell</p>
          <p>Avon Barksdale</p>
        """)


    describe "selected paragraph with next sibling being a blockquote", ->
      beforeEach ->
        SetupContentEditable([
          "<blockquote>"
          "<p>Strin[ger Be]ll</p>",
          "<p>Avon Barksdale</p>"
          "</blockquote>"
        ].join("")).then (@editor) =>
          execCommand("blockquote")

      it "should add the paragraph into the blockquote", ->
        ContentShouldEqual(@editor, """
          <p>Stringer Bell</p>
          <blockquote>
            <p>Avon Barksdale</p>
          </blockquote>
        """)

    describe "selected paragraph, last child of a blockquote", ->
      beforeEach ->
        SetupContentEditable([
          "<blockquote>"
          "<p>Avon Barksdale</p>"
          "<p>Strin[ger Be]ll</p>"
          "</blockquote>"
        ].join("")).then (@editor) =>
          execCommand("blockquote")

      it "should move the paragraph outside of the blockquote", ->
        ContentShouldEqual(@editor, """
          <blockquote>
            <p>Avon Barksdale</p>
          </blockquote>
          <p>Stringer Bell</p>
        """)

    describe "selected paragraph with surrounded by other paragraphs inside a blockquotes", ->
      beforeEach ->
        SetupContentEditable([
          "<blockquote>"
          "<p>Avon Barksdale</p>"
          "<p>Strin[ger Be]ll</p>"
          "<p>D’Angelo Barksdale</p>"
          "</blockquote>"

        ].join("")).then (@editor) =>
          execCommand("blockquote")

      it "should split up the blockquote", ->
        ContentShouldEqual(@editor, """
          <blockquote>
            <p>Avon Barksdale</p>
          </blockquote>
          <p>Stringer Bell</p>
          <blockquote>
            <p>D’Angelo Barksdale</p>
          </blockquote>
        """)
