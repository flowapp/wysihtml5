require "../lib/common"

describe "Text Substitutions", ->
  context "committing words", ->
    beforeEach ->
      url = "http://localhost:8000/test/integration_tests/html/committing_words.html"
      SetupContentEditable(undefined, url).then((@editor) =>)

    [" ",  wd.SPECIAL_KEYS["Return"]].forEach (word) =>
      context "typing `#{word}`", ->
        beforeEach ->
          @editor.type("banana#{word}stand#{word}")

        it "should commit words by typing ", ->
          browser.execute("return window.CommittedWords;").then (words) =>
            expect(words).to.deep.equal(["banana", "stand"])
