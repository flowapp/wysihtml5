require "../lib/common"
wait = require("../lib/wait")

describe "List Merger", ->
  context "collapsed range", ->
    [{
      tagName: "ol"
      context: "ordered lists"
    }, {
      tagName: "ul"
      context: "unordered lists"
    }].forEach (item, index, array) =>
      tag = item.tagName
      array.forEach (anotherItem) =>
        anotherTag = anotherItem.tagName
        if anotherItem != item
          describe "pressing backspace inside a paragraph between an #{item.context} and an #{anotherItem.context}", ->
            beforeEach ->
              SetupContentEditable("<#{tag}><li>Stringer Bell</li></#{tag}><p>|Avon Barksdale</p><#{anotherTag}><li>D’Angelo Barksdale</li></#{anotherTag}>")
                .then (@editor) =>
                  @editor.type(wd.SPECIAL_KEYS["Back space"])

            it "shouldn’t merge the two lists", ->
              ContentShouldEqual(@editor, """
                <#{tag}>
                  <li>Stringer BellAvon Barksdale</li>
                </#{tag}>
                <#{anotherTag}>
                  <li>D’Angelo Barksdale</li>
                </#{anotherTag}>
              """)

      describe "pressing backspace inside a paragraph between two #{item.context}", ->
        beforeEach ->
          SetupContentEditable("<#{tag}><li>Stringer Bell</li></#{tag}><p>|Avon Barksdale</p><#{tag}><li>D’Angelo Barksdale</li></#{tag}>")
            .then (@editor) =>
              @editor.type(wd.SPECIAL_KEYS["Back space"])

        it "should merge the lists", ->
          ContentShouldEqual(@editor, """
            <#{tag}>
              <li>Stringer BellAvon Barksdale</li>
              <li>D’Angelo Barksdale</li>
            </#{tag}>
          """)

  context "uncollapsed range", ->
    [{
      tagName: "ol"
      context: "Ordered Lists"
    }, {
      tagName: "ul"
      context: "Unordered Lists"
    }].forEach (item, index, array) =>
      tag = item.tagName
      array.forEach (anotherItem) =>
        anotherTag = anotherItem.tagName
        if anotherItem != item
          context "paragraph between an #{item.context} and an #{anotherItem.context}", ->
            beforeEach ->
              SetupContentEditable("<#{tag}><li>Stringer Be[ll</li></#{tag}><p>D’Angelo Barks]dale</p><#{anotherTag}><li>Avon Barksdale</li></#{anotherTag}>")
                .then((@editor) =>)

            context "pressing backspace", ->
              beforeEach ->
                @editor.type(wd.SPECIAL_KEYS["Back space"])

              it "shouldn’t merge the lists", ->
                ContentShouldEqual(@editor, """
                  <#{tag}>
                    <li>Stringer Bedale</li>
                  </#{tag}>
                  <#{anotherTag}>
                    <li>Avon Barksdale</li>
                  </#{anotherTag}>
                """)

            context "pressing delete", ->
              beforeEach ->
                @editor.type(wd.SPECIAL_KEYS["Delete"])

              it "shouldn’t merge the lists", ->
                ContentShouldEqual(@editor, """
                  <#{tag}>
                    <li>Stringer Bedale</li>
                  </#{tag}>
                  <#{anotherTag}>
                    <li>Avon Barksdale</li>
                  </#{anotherTag}>
                """)

            context "pressing a letter", ->
              beforeEach ->
                @editor.type("e")

              it "shouldn’t merge the lists", ->
                ContentShouldEqual(@editor, """
                  <#{tag}>
                    <li>Stringer Beedale</li>
                  </#{tag}>
                  <#{anotherTag}>
                    <li>Avon Barksdale</li>
                  </#{anotherTag}>
                """)

        context "paragraph between two #{item.context}", ->
          beforeEach ->
            SetupContentEditable("<#{tag}><li>Stringer Be[ll</li></#{tag}><p>D’Angelo Barks]dale</p><#{tag}><li>Avon Barksdale</li></#{tag}>")
              .then((@editor) =>)

          context "pressing `backspace`", ->
            beforeEach ->
              @editor.type(wd.SPECIAL_KEYS["Back space"])

            it "should merge the lists", ->
              ContentShouldEqual(@editor, """
                <#{tag}>
                  <li>Stringer Bedale</li>
                  <li>Avon Barksdale</li>
                </#{tag}>
              """)

          context "pressing `delete`", ->
            beforeEach ->
              @editor.type(wd.SPECIAL_KEYS["Delete"])

            it "should merge the lists", ->
              ContentShouldEqual(@editor, """
                <#{tag}>
                  <li>Stringer Bedale</li>
                  <li>Avon Barksdale</li>
                </#{tag}>
              """)

          context "pressing a letter", ->
            beforeEach ->
              @editor.type("e")

            it "should merge the lists", ->
              ContentShouldEqual(@editor, """
                <#{tag}>
                  <li>Stringer Beedale</li>
                  <li>Avon Barksdale</li>
                </#{tag}>
              """)
