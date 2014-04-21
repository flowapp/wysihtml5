require "../lib/common"

describe "List Commands", ->
  [{
    tag: "ol"
    context: "Ordered List"
    command: "insertOrderedList"
  }, {
    tag: "ul"
    context: "Unordered List"
    command: "insertUnorderedList"
  }].forEach (item, index, commands) =>
    describe "Insert #{item.context}", ->
      commands.forEach (anotherItem) =>
        if anotherItem != item
          describe "re-exec", ->
            beforeEach ->
              SetupContentEditable("<#{anotherItem.tag}><li>[Stringer Bell]</li></anotherItem.tag>")
                .then (@editor) =>
                  execCommand(item.command)

            it "should insert ordered list", ->
              ContentShouldEqual(@editor, """
                <#{item.tag}>
                  <li>Stringer Bell</li>
                </#{item.tag}>
              """)

      describe "unexec", ->
        describe "multi item—entire thing selected", ->
          beforeEach ->
            SetupContentEditable("<#{item.tag}><li>[Stringer Bell</li><li>Avon Barksdale]</li></#{item.tag}>")
              .then (@editor) =>
                execCommand(item.command)

          it "should insert ordered list", ->
            ContentShouldEqual(@editor, """
              <p>Stringer Bell</p>
              <p>Avon Barksdale</p>
            """)

        describe "multi item—collapsed range", ->
          beforeEach ->
            SetupContentEditable("<#{item.tag}><li>Stringer B|ell</li><li>Avon Barksdale</li></#{item.tag}>")
              .then (@editor) =>
                execCommand(item.command)

          it "should insert ordered list", ->
            ContentShouldEqual(@editor, """
              <p>Stringer Bell</p>
              <#{item.tag}>
                <li>Avon Barksdale</li>
              </#{item.tag}>
            """)

        describe "single item—collapsed range", ->
          beforeEach ->
            SetupContentEditable("<#{item.tag}><li>Stringer B|ell</li></#{item.tag}>")
              .then (@editor) =>
                execCommand(item.command)

          it "should insert ordered list", ->
            ContentShouldEqual(@editor, """
              <p>Stringer Bell</p>
            """)

        describe "single item—not collapsed range", ->
          beforeEach ->
            SetupContentEditable("<#{item.tag}><li>Stri[nger Bell]</li></#{item.tag}>")
              .then (@editor) =>
                execCommand(item.command)

          it "should insert ordered list", ->
            ContentShouldEqual(@editor, """
              <p>Stringer Bell</p>
            """)


      describe "exec", ->
        context "single paragraph element", ->
          beforeEach ->
            SetupContentEditable("<p>[Stringer Bell]</p>")
              .then (@editor) =>
                execCommand(item.command)

          it "should insert ordered list", ->
            ContentShouldEqual(@editor, """
              <#{item.tag}>
                <li>Stringer Bell</li>
              </#{item.tag}>
            """)

        context "multiple paragraph element", ->
          beforeEach ->
            SetupContentEditable("<p>Mail insur[ance check</p><p>Burn down bana]na stand</p>")
              .then (@editor) =>
                execCommand(item.command)

          it "should insert ordered list", ->
            ContentShouldEqual(@editor, """
              <#{item.tag}>
                <li>Mail insurance check</li>
                <li>Burn down banana stand</li>
              </#{item.tag}>
            """)
