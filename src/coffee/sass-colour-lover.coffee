###
# Use COLOURLover's API to auto-magically populate your Sass stylesheets.
###

'use strict'

http = require 'http'
fs = require 'fs'
path = require 'path'

module.exports.Palette = {}

class module.exports.Palette

  @author : ''
  @colorCount : 0
  @colors : []
  @file : '_palette.scss'
  @colorFormat : 'rgb'
  @hostname : 'www.colourlovers.com'
  @paletteID : null
  @tabSize : 0
  @title : ''
  @totalColors : 0
  @url : ''
  @append : false
  @multi : true
  @palettes : null
  @errors : 0
  @sep : '-'

  ###
  # Getters
  ###

  @getAppend : ->
    @append

  @getCount : ->
    @colorCount

  @getHost : ->
    @hostname

  @getMulti : ->
    @multi

  @getTotalColors : ->
    @totalColors

  @getColorByTitle : (title)->
    return color for color in @colors when color.title is title

  @getSep : ->
    @sep

  ###
  # Setters
  ###

  @resetColors : ->
    @colors = []

  @resetCount : ->
    @colorCount = 0

  @setAppend : (@append)->

  @setAuthor : (@author)->

  @setFile : (@file)->

  @setFormat : (@colorFormat)->

  @setMulti : (@multi)->

  @setPalettes : (@palettes)->

  @setTitle : (@title)->

  @setTotalColors : (@totalColors)->

  @setUrl : (@url)->

  @addColor : (title, hex, rgb)->

    title = module.exports.Palette.trimHyphens title
    title = 'color' if title.length is 0
    title = module.exports.Palette.individualize title, title
    title = module.exports.Palette.fixLeadingNumber title

    if title.length > @tabSize
      @tabSize = title.length

    @colors.push
      title : title
      hex : hex
      rgb : rgb

  ###
  # This method ensures that Sass variable names are unique.
  ###

  @individualize : (title, base = '', count = 1)->

    existingColor = module.exports.Palette.getColorByTitle title

    if existingColor?
      # A duplicate title has been found
      # We have to modify the title.

      modifiedTitle = "#{base}-#{count}"

      title = module.exports.Palette.individualize modifiedTitle, base, count+1
    
    return title

  ###
  # Fix titles that end in '-'
  ###

  @trimHyphens : (title)->
    matches = /^-|-$/.exec title

    if matches?
      
      title = module.exports.Palette.trimHyphens title.replace /^\-|\-$/g, ''

    return title

  ###
  # Fix titles that have leading numbers
  ###

  @fixLeadingNumber : (title)->
    numberFlag = /^(\d)(.*)/
    match = numberFlag.exec title

    if match?
      title = "color-#{title}"

    return title

  @incrementCount : ->
    @colorCount++

  @incrementErrors : ->
    @errors++

  @writeFile : ->

    output = "// Palette: #{@title}\r\n"
    output += "// Author: #{@author}\r\n"
    output += "// #{@url}\r\n"
    output += "\r\n"

    for color in @colors

      output += '$' + color.title + ':'

      bufferSize = @tabSize - color.title.length
      bufferSize += 4
      buffer = Array(bufferSize).join ' '

      output += buffer

      value = if @colorFormat is 'hex' then color.hex else color.rgb
      output += value
      output += ';\r\n'

    if module.exports.Palette.getAppend() is false

      fs.writeFile @file, output, (error)->

        if error?
          console.log error

        module.exports.Palette.setAppend true

        if module.exports.Palette.palettes?

          if module.exports.Palette.palettes.length  > 0 and
          module.exports.Palette.getMulti() is true

            nextPalette = module.exports.Palette.palettes.pop()

            module.exports.Palette.requestPalette nextPalette

    else if module.exports.Palette.getAppend() is true

      output = "\r\n" + output

      fs.appendFile @file, output, (error)->

        if error?
          console.log error

        if module.exports.Palette.palettes.length > 0

          nextPalette = module.exports.Palette.palettes.pop()

          module.exports.Palette.requestPalette nextPalette

  ###
  # This method decides how command line arguments are handled
  ###

  @parameterize : (parameter)->
    option = /^--(file|color)=(.*)/.exec parameter

    if option?

      switch option[1]

        when 'file'
          if option[2]?
            module.exports.Palette.setFile option[2]
        when 'color'
          if option[2]?
            module.exports.Palette.setFormat option[2]

  @requestPalette : (id)->

    options =
      hostname : module.exports.Palette.getHost()
      path : "/api/palette/#{id}/?format=json"

    request = http.request options, (response)->
      module.exports.Palette.paletteCallback response

    request.end()

  @paletteCallback : (response)->

    if response.statusCode is 200

      paletteData = ''

      response.on 'data', (chunk)->
        paletteData += chunk

      response.on 'end', ->
        palette = {}

        palette = JSON.parse(paletteData)[0]

        if (typeof palette) isnt 'undefined'
          module.exports.Palette.setAuthor palette.userName
          module.exports.Palette.setTitle palette.title
          module.exports.Palette.setUrl palette.url
          module.exports.Palette.colorsCallback palette.colors

        else
          console.log 'ERROR: No matching palette was found'

  @colorsCallback : (colors)->

    if (Object.prototype.toString.call colors) is '[object Array]'

      module.exports.Palette.setTotalColors colors.length
      module.exports.Palette.resetCount()
      module.exports.Palette.resetColors()

      for color in colors

        options =
          hostname : module.exports.Palette.getHost()
          path : "/api/color/#{color}?format=json"

        request = http.request options, (response)->
          colorData = ''

          response.on 'data', (chunk)->
            colorData += chunk

          response.on 'end', ->
            color = JSON.parse(colorData)[0]
            title = color.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()
            hex = '#' + color.hex
            rgb = "rgb(#{color.rgb.red},"+
              "#{color.rgb.green}," +
              "#{color.rgb.blue})"

            module.exports.Palette.addColor title, hex, rgb

            module.exports.Palette.incrementCount()

            count = module.exports.Palette.getCount()
            total = module.exports.Palette.getTotalColors()

            if count is total
              module.exports.Palette.writeFile()

        request.end()

    else
      console.log 'ERROR: Palette does not contain any colors!'

###
# Command-Line Interface
###

parameters = process.argv.slice 2

id = null
isMulti = false
isURL = false

idFlag = /^(--ids=)(.*)/
urlFlag = /^(http:\/\/|)(www\.|)colourlovers\.com\/palette\/(\d+)\//

if parameters.length > 0

  for parameter in parameters

    matches = idFlag.exec parameter

    if not matches?

      matches = urlFlag.exec parameters

      if matches?

        id = matches[3]
        isURL = true

        break

    else

      id = matches[2]

      break

###
# The script requires an ID or URL
###

if id?

  for parameter in parameters

    module.exports.Palette.parameterize parameter

  ###
  # Avoid performing string splitting on URL sources
  ###

  if isURL is false
    multiFlag = /\,/
    multi = multiFlag.exec id

    if multi?
      module.exports.Palette.setMulti true
      module.exports.Palette.setPalettes multi.input.split ','
      id = module.exports.Palette.palettes.pop()

    module.exports.Palette.requestPalette id

  else

    module.exports.Palette.requestPalette id

else

  console.log 'ERROR: No palette ID has been provided'