{convertNestedBlockquoteIntoParagraph} = require("wysihtml5/helpers/convert_nested_blockquote_into_paragraph")
{nodeList} = require("wysihtml5/dom/node_list")

describe "Helper: convert nested blockquote into paragraphs", ->
  beforeEach ->
    @playground = document.createElement "div"
    document.body.appendChild(@playground)

  afterEach ->
    document.body.removeChild(@playground)

  ["p", "h1", "h2", "h3", "h4", "h5", "h6", "pre"].forEach (tag) =>
    describe "blockquote with a #{tag}", ->
      beforeEach ->
        @playground.innerHTML = "<blockquote><#{tag}>Stringer Bell</#{tag}></blockquote>"
        @stringer = @playground.querySelector(tag)
        @results = convertNestedBlockquoteIntoParagraph(@stringer)

      it "should convert the list into one #{tag}", ->
        expect(@playground.innerHTML).to.equal("<#{tag}>Stringer Bell</#{tag}>")

    describe "nested blockquotes containing a `#{tag}`", ->
      beforeEach ->
        @playground.innerHTML = [
          "<blockquote>"
          "<blockquote>"
          "<#{tag}>Stringer Bell</#{tag}>"
          "</blockquote>"
          "</blockquote>"
        ].join("")
        @stringer = @playground.querySelector(tag)
        @results = convertNestedBlockquoteIntoParagraph(@stringer)

      it "should convert the list into one #{tag}", ->
        expect(@playground.innerHTML).to.equal([
          "<blockquote>"
          "<#{tag}>Stringer Bell</#{tag}>"
          "</blockquote>"
        ].join(""))

    describe "blockquote with multiple #{tag}-s—first child", ->
      beforeEach ->
        @playground.innerHTML = [
          "<blockquote>"
          "<#{tag}>Stringer Bell</#{tag}>"
          "<#{tag}>Avon Barksdale</#{tag}>"
          "</blockquote>"
        ].join("")
        @stringer = @playground.querySelector(tag)
        @results = convertNestedBlockquoteIntoParagraph(@stringer)

      it "should convert the list into one #{tag}", ->
        expect(@playground.innerHTML).to.equal([
          "<#{tag}>Stringer Bell</#{tag}>"
          "<blockquote>"
          "<#{tag}>Avon Barksdale</#{tag}>"
          "</blockquote>"
        ].join(""))

    describe "blockquote with multiple #{tag}-s—last child", ->
      beforeEach ->
        @playground.innerHTML = [
          "<blockquote>"
          "<#{tag}>Stringer Bell</#{tag}>"
          "<#{tag}>Avon Barksdale</#{tag}>"
          "</blockquote>"
        ].join("")
        @avon = @playground.querySelector("#{tag}:last-child")
        @results = convertNestedBlockquoteIntoParagraph(@avon)

      it "should convert the list into one #{tag}", ->
        expect(@playground.innerHTML).to.equal([
          "<blockquote>"
          "<#{tag}>Stringer Bell</#{tag}>"
          "</blockquote>"
          "<#{tag}>Avon Barksdale</#{tag}>"
        ].join(""))

    describe "blockquote with multiple #{tag}-s—inbetween", ->
      beforeEach ->
        @playground.innerHTML = [
          "<blockquote>"
          "<#{tag}>Stringer Bell</#{tag}>"
          "<#{tag}>Avon Barksdale</#{tag}>"
          "<#{tag}>D’Angelo Barksdale</#{tag}>"
          "</blockquote>"
        ].join("")
        @avon = @playground.querySelector("#{tag}:not(:last-child):not(:first-child)")
        @results = convertNestedBlockquoteIntoParagraph(@avon)

      it "should convert the list into one #{tag}", ->
        expect(@playground.innerHTML).to.equal([
          "<blockquote>"
          "<#{tag}>Stringer Bell</#{tag}>"
          "</blockquote>"
          "<#{tag}>Avon Barksdale</#{tag}>"
          "<blockquote>"
          "<#{tag}>D’Angelo Barksdale</#{tag}>"
          "</blockquote>"
        ].join(""))
