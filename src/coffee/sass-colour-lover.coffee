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

  @setFormat : (@colorFormat)->

  @setTitle : (@title)->

  @setTotalColors : (@totalColors)->

  @setUrl : (@url)->

  @addColor : (title, hex, rgb)->

    title = module.exports.Palette.stripTrailingDashes title
    title = module.exports.Palette.individualize title, title
    title += ':'

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

      title = module.exports.Palette.individualize modifiedTitle,
        base, count + 1
    
    return title

  ###
  # Fix titles that end in '-'
  ###

  @stripTrailingDashes : (title)->
    if title.length > 1

      if title.substr(-1) is '-'
        title = title.substr 0, title.length - 1
        title = module.exports.Palette.stripTrailingDashes title

    return title

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

      value = if @colorFormat is 'hex' then color.hex else color.rgb
      output += value
      output += ';\r\n'

    fs.writeFile @file, output, (error)=>
      if error?
        console.log error
      else
        console.log "Successfully created #{@file}"

  ###
  # This method decides how command line arguments are handled
  ###

  @parameterize : (parameter)->
    option = /^--(file|format)=(.*)/.exec parameter

    if option?

      switch option[1]

        when 'file'
          if option[2]?
            module.exports.Palette.setFile option[2]
        when 'format'
          if option[2]?
            module.exports.Palette.setFormat option[2]

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
            title = "$#{title}"
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

idFlag = /^(--id=)(\d+)/
urlFlag = /^(http:\/\/|)(www\.|)colourlovers\.com\/palette\/(\d+)\//

if parameters.length > 0

  for parameter in parameters

    matches = idFlag.exec parameter

    if not matches?

      matches = urlFlag.exec parameters

      if matches?

        id = matches[3]

        break

    else

      id = matches[2]

      break

if id?

  options =
    hostname : module.exports.Palette.getHost()
    path : "/api/palette/#{id}/?format=json"

  request = http.request options, (response)->
    module.exports.Palette.paletteCallback response

  request.end()

else

  console.log 'ERROR: No palette ID has been provided'