require "../lib/common"

describe.skip "Auto linking", ->
  beforeEach ->
    SetupContentEditable("").then((@editor) =>)

  [{
    url: "http://getflow.com/"
    protocol: "http://"
  }, {
    url: "https://getflow.com/"
    protocol: "https://"
  }, {
    url: "www.getflow.com"
    protocol: "www"
    expectedURL: "http://www.getflow.com"
  }, {
    url: "mailto:michael@bluth.com"
    protocol: "mailto:"
  }].forEach (item) =>
    describe "auto-linking starting with `#{item.protocol}`", ->
      beforeEach ->
        @editor.type("#{item.url} ")

      it "should auto link URLs starting with `#{item.protocol}`", ->
        ContentShouldEqual(@editor, """
          <p><a href="#{item.expectedURL || item.url}">#{item.url}</a></p>
        """)
