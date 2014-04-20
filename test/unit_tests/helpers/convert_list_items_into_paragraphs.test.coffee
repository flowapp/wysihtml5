convertListItemsIntoParagraphs = require("wysihtml5/helpers/convert_list_item_into_paragraph").default
nodeList = require("wysihtml5/dom/node_list").nodeList

describe "Helper - convertListItemsIntoParagraphs", ->
  beforeEach ->
    @playground = document.createElement "div"
    document.body.appendChild(@playground)

  afterEach ->
    document.body.removeChild(@playground)

  describe "single item list", ->
    beforeEach ->
      @playground.innerHTML = "<ul><li>Stringer Bell</li></ul>"
      @stringer = @playground.querySelector("li")
      @results = convertListItemsIntoParagraphs([@stringer])

    it "should convert the list into one paragraph", ->
      expect(@playground.innerHTML).to.equal("<p>Stringer Bell</p>")

    it "should return the parapgraphs", ->
      expect(@results.length).to.equal(1)
      expect(@results[0]).to.equal(@playground.querySelector("P"))

  describe "multi item list, first item", ->
    beforeEach ->
      @playground.innerHTML = "<ul><li>Stringer Bell</li><li>Avon Barksdale</li></ul>"
      @stringer = @playground.querySelector("li:first-child")
      @results = convertListItemsIntoParagraphs([@stringer])

    it "should convert the list item into a paragraph", ->
      expect(@playground.innerHTML).to.equal("<p>Stringer Bell</p><ul><li>Avon Barksdale</li></ul>")

    it "should return the parapgraphs", ->
      expect(@results.length).to.equal(1)
      expect(@results[0]).to.equal(@playground.querySelector("P"))

  describe "multi item list, first two items", ->
    beforeEach ->
      @playground.innerHTML = "<ul><li>Stringer Bell</li><li>Avon Barksdale</li><li>D’Angelo Barksdale</li></ul>"
      @items = nodeList.toArray(@playground.querySelectorAll("li"))[0...2]
      @results = convertListItemsIntoParagraphs(@items)

    it "should convert the list item into a paragraph", ->
      expect(@playground.innerHTML).to.equal([
        "<p>Stringer Bell</p>"
        "<p>Avon Barksdale</p>"
        "<ul><li>D’Angelo Barksdale</li></ul>"
      ].join(""))

    it "should return the parapgraphs", ->
      expect(@results.length).to.equal(2)
      nodes = nodeList.toArray(@playground.querySelectorAll("P"))
      expect(@results).to.deep.equal(nodes)

  describe "multi item list, last two items", ->
    beforeEach ->
      @playground.innerHTML = [
        "<ul>"
        "<li>Stringer Bell</li>"
        "<li>Avon Barksdale</li>"
        "<li>D’Angelo Barksdale</li>"
        "</ul>"
      ].join("")
      @items = nodeList.toArray(@playground.querySelectorAll("li"))[1...3]
      @results = convertListItemsIntoParagraphs(@items)

    it "should convert the list item into a paragraph", ->
      expect(@playground.innerHTML).to.equal([
        "<ul><li>Stringer Bell</li></ul>"
        "<p>Avon Barksdale</p>"
        "<p>D’Angelo Barksdale</p>"
      ].join(""))

    it "should return the parapgraphs", ->
      expect(@results.length).to.equal(2)
      nodes = nodeList.toArray(@playground.querySelectorAll("P"))
      expect(@results).to.deep.equal(nodes)

  describe "multi item list, two non trailing nor leading nodes", ->
    beforeEach ->
      @playground.innerHTML = [
        "<ul>"
        "<li>Stringer Bell</li>"
        "<li>Avon Barksdale</li>"
        "<li>D’Angelo Barksdale</li>"
        "<li>Omar Little</li>"
        "</ul>"
      ].join("")
      @items = nodeList.toArray(@playground.querySelectorAll("li"))[1...3]
      @results = convertListItemsIntoParagraphs(@items)

    it "should convert the list item into a paragraph", ->
      expect(@playground.innerHTML).to.equal([
        "<ul><li>Stringer Bell</li></ul>"
        "<p>Avon Barksdale</p>"
        "<p>D’Angelo Barksdale</p>"
        "<ul><li>Omar Little</li></ul>"
      ].join(""))

    it "should return the parapgraphs", ->
      expect(@results.length).to.equal(2)
      nodes = nodeList.toArray(@playground.querySelectorAll("P"))
      expect(@results).to.deep.equal(nodes)

  describe "multi item list, last item", ->
    beforeEach ->
      @playground.innerHTML = "<ul><li>Stringer Bell</li><li>Avon Barksdale</li></ul>"
      @avon = @playground.querySelector("li:last-child")
      @results = convertListItemsIntoParagraphs([@avon])

    it "should convert the list item into a paragraph", ->
      expect(@playground.innerHTML).to.equal("<ul><li>Stringer Bell</li></ul><p>Avon Barksdale</p>")

    it "should return the parapgraphs", ->
      expect(@results.length).to.equal(1)
      expect(@results[0]).to.equal(@playground.querySelector("P"))

  describe "multi item list, middle item", ->
    beforeEach ->
      @playground.innerHTML = "<ul><li>Stringer Bell</li><li>Avon Barksdale</li><li>D’Angelo Barksdale</li></ul>"
      @avon = @playground.querySelector("li:not(:first-child):not(:last-child)")
      @results = convertListItemsIntoParagraphs([@avon])

    it "should convert the list item into a paragraph", ->
      expect(@playground.innerHTML).to.equal("<ul><li>Stringer Bell</li></ul><p>Avon Barksdale</p><ul><li>D’Angelo Barksdale</li></ul>")

    it "should return the parapgraphs", ->
      expect(@results.length).to.equal(1)
      expect(@results[0]).to.equal(@playground.querySelector("P"))
