require "../lib/common"

describe "Break List", ->
  [{
    nodeName: "UL"
    context: "Unordered List"
  }, {
    nodeName: "OL"
    context: "Ordered List"
  }].forEach (item) =>
    context item.context, ->
      beforeEach ->
        SetupContentEditable("""
          <#{item.nodeName}><li>Banana</li><li>|</li></#{item.nodeName}>
        """).then (@editor) =>
          @editor.type(wd.SPECIAL_KEYS["Return"])

      it "should list items in #{item.nodeName}", ->
        ContentShouldEqual(@editor, """
          <#{item.nodeName}>
            <li>Banana</li>
          </#{item.nodeName}>
          <p><br></p>
        """)
