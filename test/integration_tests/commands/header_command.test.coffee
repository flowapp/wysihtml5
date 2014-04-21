require "../lib/common"

describe "Header command", ->
  ["h1", "h2", "h3", "h4", "h5", "h6"].forEach (tag, index, tags) =>
    context "<#{tag}>", ->
      context "#exec", ->
        describe "fully selecting a node", ->
          beforeEach ->
            SetupContentEditable("<p>[Stringer Bell]</p>").then (@editor) =>
              execCommand("header", tag)

          it "should convert the paragraph into a header", ->
            ContentShouldEqual(@editor, """
              <#{tag}>Stringer Bell</#{tag}>
            """)

        describe "partly selecting a node", ->
          beforeEach ->
            SetupContentEditable("<p>Stringer B[ell]</p>").then (@editor) =>
              execCommand("header", tag)

          it "should convert the paragraph into a header", ->
            ContentShouldEqual(@editor, """
              <#{tag}>Stringer Bell</#{tag}>
            """)

        describe "collapsed range inside a populated node", ->
          beforeEach ->
            SetupContentEditable("<p>Strin|ger Bell</p>").then (@editor) =>
              execCommand("header", tag)

          it "should convert the paragraph into a header", ->
            ContentShouldEqual(@editor, """
              <#{tag}>Stringer Bell</#{tag}>
            """)

        describe "collapsed range inside empty node", ->
          beforeEach ->
            SetupContentEditable("<p>|<br></p>")
              .then (@editor) =>
                execCommand("header", tag)

          it "should create an empty header element", ->
            ContentShouldEqual(@editor, """
              <#{tag}><br></#{tag}>
            """)

      describe "reexec", ->
        tags.forEach (anotherTag) =>
          if anotherTag != tag
            describe "morphing a <#{tag}> into a <#{anotherTag}>", ->
              describe "with a selection spanning over the entire content", ->
                beforeEach ->
                  SetupContentEditable("<#{anotherTag}>[Stringer Bell]</#{anotherTag}>").then (@editor) =>
                    execCommand("header", tag)

                it "should morph the <#{tag}> into a <#{anotherTag}>", ->
                  ContentShouldEqual(@editor, """
                    <#{tag}>Stringer Bell</#{tag}>
                  """)

              describe "with a collapsed selection", ->
                beforeEach ->
                  SetupContentEditable("<#{anotherTag}>String|er Bell</#{anotherTag}>").then (@editor) =>
                    execCommand("header", tag)

                it "should morph the <#{tag}> into a <#{anotherTag}>", ->
                  ContentShouldEqual(@editor, """
                    <#{tag}>Stringer Bell</#{tag}>
                  """)

      describe "HeaderCommand#unexec", ->
        context "selected entire header node", ->
          beforeEach ->
            SetupContentEditable("<#{tag}>[Stringer Bell]</#{tag}>").then (@editor) =>
              execCommand("header", tag)

          it "should resolve the header into a paragraph", ->
            ContentShouldEqual(@editor, """
              <p>Stringer Bell</p>
            """)

        context "collapsed range in header node", ->
          beforeEach ->
            SetupContentEditable("<#{tag}>Strin|ger Bell</#{tag}>").then (@editor) =>
              execCommand("header", tag)

          it "should resolve the entire header into a paragraph", ->
            ContentShouldEqual(@editor, """
              <p>Stringer Bell</p>
            """)
