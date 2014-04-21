require "../lib/common"

describe "Delete block elements", ->
  # TODO improve blockquote coverage
  [{
    tagName: "pre"
    context: "preformatted text"
  }, {
    tagName: "blockquote"
    context: "blockquote"
  }].forEach (item) =>
    context item.context, ->
      beforeEach ->
        SetupContentEditable("<#{item.tagName}>[]Banana stand</#{item.tagName}>")
          .then (@editor) =>
            @editor.type(wd.SPECIAL_KEYS["Back space"])

      it "should convert #{item.context} element to a paragraph element", ->
        ContentShouldEqual(@editor, "<p>Banana stand</p>")

  [{
    tagName: "ul",
    context: "unordered list"
  }, {
    tagName: "ol",
    context: "ordered list"
  }].forEach (item) =>
    context "list item in a #{item.context}", ->
      context "only child", ->
        beforeEach ->
          SetupContentEditable("<#{item.tagName}><li>|Banana stand</li></#{item.tagName}>")
            .then (@editor) =>
              @editor.type(wd.SPECIAL_KEYS["Back space"])

        it "should convert list item into a paragraph", ->
          ContentShouldEqual(@editor, "<p>Banana stand</p>")

      context "first child", ->
        beforeEach ->
          SetupContentEditable("<#{item.tagName}><li>[]Burn down banana stand</li><li>Mail insurance check</li></#{item.tagName}>")
            .then (@editor) =>
              @editor.type(wd.SPECIAL_KEYS["Back space"])

        it "should convert list item into a paragraph", ->
          ContentShouldEqual(@editor, """
            <p>Burn down banana stand</p>
            <#{item.tagName}>
              <li>Mail insurance check</li>
            </#{item.tagName}>
          """)

      context "last child", ->
        beforeEach ->
          SetupContentEditable("<#{item.tagName}><li>Burn down banana stand</li><li>|Mail insurance check</li></#{item.tagName}>")
            .then (@editor) =>
              @editor.type(wd.SPECIAL_KEYS["Back space"])

        it "should convert list item into a paragraph", ->
          ContentShouldEqual(@editor, """
            <#{item.tagName}>
              <li>Burn down banana stand</li>
            </#{item.tagName}>
            <p>Mail insurance check</p>
          """)

      context "middle child", ->
        beforeEach ->
          content = "<#{item.tagName}><li>Burn down banana stand</li><li>|Mail insurance check</li><li>Something</li></#{item.tagName}>";
          SetupContentEditable(content)
            .then (@editor) =>
              @editor.type(wd.SPECIAL_KEYS["Back space"])

        it "should convert list item into a paragraph", ->
          content =
          ContentShouldEqual(@editor, """
            <#{item.tagName}>
              <li>Burn down banana stand</li>
            </#{item.tagName}>
            <p>Mail insurance check</p>
            <#{item.tagName}>
              <li>Something</li>
            </#{item.tagName}>
          """)
