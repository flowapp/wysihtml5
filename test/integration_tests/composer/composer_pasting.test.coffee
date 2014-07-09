require "../lib/common"
YAML = require('yamljs')

files = [
  "#{__dirname}/pasting_specs.yml"
  "#{__dirname}/pasting_collaped_range_specs.yml"
  "#{__dirname}/pasting_list_specs.yml"

]

describe "Pasting", ->
  for file in files
    specs = YAML.load(file)
    for spec in specs #when spec.debug
      do (spec) =>
        describe spec.description, ->
          beforeEach ->
            @timeout(300000)
            @editor = new Editor(spec.content)

          context "text/html", ->
            it spec.it || "TEMP", (done) ->
              @timeout(300000)
              pasteHTML(spec.clipboard.html).then =>
                @editor.shouldEqual(spec.shouldEqual.html || spec.shouldEqual, spec.debug)

          context "text/plain", ->
            it spec.it || "TEMP", (done) ->
              @timeout(300000)
              pasteText(spec.clipboard.plain).then =>
                @editor.shouldEqual(spec.shouldEqual.plain || spec.shouldEqual, spec.debug)
