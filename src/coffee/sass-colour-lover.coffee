###
# Uses the COLOURLovers Palette and Color API to dynamcally generate a
# Sass variable stylesheet.
###

http = require 'http'
fs = require 'fs'

SCL = {}
SassColourLover.Palette = {}

SassColourLover.parameters = process.argv.slice 2

class SassColourLover.Palette

  @author : ''
  @colorCount : 0
  @colors : []
  @file : '_palette.scss'
  @format : 'rgb'
  @hostname : 'www.colourlovers.com'
  @paletteID : null 
  @tabSize : 0
  @title : ''
  @totalColors : 0
  @url : ''
  @queried : false

  @addColor : (title, hex, rgb)->

    title = SassColourLover.Palette.stripTrailingDashes title
    title = SassColourLover.Palette.individualize title, title

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


    existingColor = SassColourLover.Palette.getColorByTitle title

    if existingColor?
      # A duplicate title has been found
      # We have to modify the title.

      modifiedTitle = "#{base}-#{count}"

      title = SassColourLover.Palette.individualize
        modifiedTitle,
        base,
        count + 1
    
    return title

  ###
  # Fix titles that end in '-'
  ###

  @stripTrailingDashes : (title)->
    if title.length > 1

      if title.substr(-1) is '-'
        title = title.substr 0, title.length - 1
        title = SassColourLover.Palette.stripTrailingDashes title

    return title
  
  ###
  # Getters
  ###

  @getCount : ->
    @colorCount

  @getHost : ->
    @hostname

  @getTotalColors : ->
    @totalColors

  @getColorByTitle : (title)->
    return color for color in @colors when color.title is title

  ###
  # Setters
  ###

  @setAuthor : (@author)->

  @setFile : (@file)->

  @setFormat : (@format)->

  @setTitle : (@title)->

  @setTotalColors : (@totalColors)->

  @setUrl : (@url)->

  @incrementCount : ->
    @colorCount++

  @writeFile : ->

    output = "// Palette: #{@title} by #{@author}\r\n"
    output += "// #{@url}\r\n"
    output += "\r\n"

    for color in @colors
      output += color.title

      bufferSize = @tabSize - color.title.length
      bufferSize += 4
      buffer = Array(bufferSize).join ' '

      output += buffer

      value = if @format is 'hex' then color.hex else color.rgb
      output += value
      output += ';\r\n'

    fs.writeFile @file, output, (error)=>
      if error?
        console.log error
      else
        console.log "Successfully created #{@file}"

  @parameterize : (parameter)->

    option = /^--(file|format)=(.*)/.exec parameter

    if option?

      switch option[1]

        when 'file'
          if option[2]?
            SassColourLover.Palette.setFile option[2]
        when 'format'
          if option[2]?
            SassColourLover.Palette.setFormat option[2]

  @paletteCallback : (response)->

    if response.statusCode is 200
      paletteData = ''

      response.on 'data', (chunk)->
        paletteData += chunk

      response.on 'end', ->
        palette = {}

        palette = JSON.parse(paletteData)[0]

        if (typeof palette) isnt 'undefined'
          SassColourLover.Palette.setAuthor palette.userName
          SassColourLover.Palette.setTitle palette.title
          SassColourLover.Palette.setUrl palette.url

          SassColourLover.Palette.colorsCallback palette.colors

        else
          console.log 'ERROR: No matching palette was found'

  @colorsCallback : (colors)->

    if (Object.prototype.toString.call colors) is '[object Array]'

      SassColourLover.Palette.setTotalColors colors.length

      for color in colors

        options =
          hostname : SassColourLover.Palette.getHost()
          path : "/api/color/#{color}?format=json"

        request = http.request options, (response)->
          colorData = ''

          response.on 'data', (chunk)->
            colorData += chunk

          response.on 'end', ->
            color = JSON.parse(colorData)[0]
            title = color.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()
            title = "$#{title}"
            hex = '#' + color.hex
            rgb = "rgb(#{color.rgb.red},"+
              "#{color.rgb.green}," +
              "#{color.rgb.blue})"

            SassColourLover.Palette.addColor title, hex, rgb

            SassColourLover.Palette.incrementCount()

            count = SassColourLover.Palette.getCount()
            total = SassColourLover.Palette.getTotalColors()

            if count is total
              SassColourLover.Palette.writeFile()

        .end()

    else
      console.log 'ERROR: Palette does not contain any colors!'

###
# The handling of the ID parameter is done outside of parameterize() to
# ensure that it is not executed more than once
###

idflag = /^(--id=)(.*)/

if SassColourLover.parameters.length > 0

  id = null

  for i in [0...SassColourLover.parameters.length]

    result = idflag.exec SassColourLover.parameters[i]

    if result?

      id = result[2]

      if id?

        for j in [0...SassColourLover.parameters.length]
          SassColourLover.Palette.parameterize SassColourLover.parameters[j]

        options =
          hostname : SassColourLover.Palette.getHost()
          path : "/api/palette/#{id}/?format=json"

        request = http.request options, (response)->
          SassColourLover.Palette.paletteCallback response
        request.end()

      else

        console.log 'ERROR: No palette ID has been provided'

      break

else

  console.log 'ERROR: No palette ID has been provided'