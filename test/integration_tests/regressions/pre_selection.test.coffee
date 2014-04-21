require "../lib/common"

# Post command selections are currently not being tested, but they obviously
# should be. When we have the infrastructure to test it, should this be part
# of the `PreCommand` test suite

describe.skip "Regression: set selection correctly after executing `PreCommand`", ->
  context "not-collapsed range", ->
    beforeEach ->
      SetupContentEditable("<p>[Stringer Bell]</p>")
        .then (@editor) =>
          execCommand("pre")
        .then =>
          @editor.type("Avon Barksdale")

    it "shouldn’t set the selection before the `pre`", ->
      ContentShouldEqual(@editor, "<pre>Avon Barksdale</pre>")

  context "collapsed range, at the start of the node", ->
    beforeEach ->
      SetupContentEditable("<p>|Stringer Bell</p>")
        .then (@editor) =>
          execCommand("pre")
        .then =>
          @editor.type("Avon Barksdale, ")

    it "shouldn’t set the selection before the `pre`", ->
      ContentShouldEqual(@editor, "<pre>Avon Barksdale, Stringer Bell</pre>")

  context "collapsed range, at the end of the node", ->
    beforeEach ->
      SetupContentEditable("<p>Stringer Bell|</p>")
        .then (@editor) =>
          execCommand("pre")
        .then =>
          @editor.type(", Avon Barksdale")

    it "shouldn’t set the selection before the `pre`", ->
      ContentShouldEqual(@editor, "<pre>Stringer Bell, Avon Barksdale</pre>")

  context "collapsed range, at the end of the node", ->
    beforeEach ->
      SetupContentEditable("<p>Avon| Barksdale</p>")
        .then (@editor) =>
          execCommand("pre")
        .then =>
          @editor.type(" and D’Angelo")

    it "shouldn’t set the selection before the `pre`", ->
      ContentShouldEqual(@editor, "<pre>Avon and D’Angelo Barksdale</pre>")
