require "../lib/common"

describe "Auto Listing", ->
  beforeEach ->
    SetupContentEditable("<p></p>").then((@editor) =>)

  context "unordered lists", ->
    ["*", "-", "•"].forEach (option) =>
      describe "auto-listing", ->
        beforeEach ->
          @editor.type("#{option} test")

        it "should auto-list an unordered list by typing #{option}", ->
          ContentShouldEqual(@editor, "<ul><li>test</li></ul>")

      describe "not-auto-listing", ->
        beforeEach ->
          @editor.type("#{option} #{option} test")

        it "should not auto list inside a list-item, by typing #{option}", ->
          ContentShouldEqual(@editor, "<ul><li>#{option} test</li></ul>")

  context "ordered lists", ->
    context "committing by typing `1.`", ->
      beforeEach ->
        @editor.type("1. test")
      it "should auto-list an ordered list", ->
        ContentShouldEqual(@editor, "<ol><li>test</li></ol>")

    context "committing by typing `1.`", ->
      beforeEach ->
        @editor.type("1. 1. test")
      it "should not auto list inside a list-item, by typing 1.", ->
        ContentShouldEqual(@editor, "<ol><li>1. test</li></ol>")

  ["*", "-", "•", "1."].forEach (option) =>
    context "committing by typing `#{option}`", ->
      beforeEach ->
        @editor.type("test #{option} test")
      it "should not auto-list—if the committed word is at the beginning of its block element", ->
        ContentShouldEqual(@editor, "<p>test #{option} test</p>")
