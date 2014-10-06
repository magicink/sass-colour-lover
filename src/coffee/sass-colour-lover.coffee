###
# Uses the COLOURLovers Palette and Color API to dynamcally generate a
# Sass variable stylesheet.
#
# Usage: node cl-paletteto-sass.js
#
# id:       The unique ID of the palette provided by COLOURLovers
#
# file:     The file (including the path) that will be generated. (default:
#           './_colors.scss')
#
# format:   Determines whether colors are written in RGB or hexidecimal
#           format. (default: 'rgb') 
###

http = require 'http'
fs = require 'fs'

parameters = process.argv.slice 2

class Palette

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

    if title.length > @tabSize
      @tabSize = title.length

    @colors.push
      title : title
      hex : hex
      rgb : rgb
  
  ###
  # Getters
  ###

  @getCount : ->
    @colorCount

  @getHost : ->
    @hostname

  @getTotalColors : ->
    @totalColors

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

paletteCallback = (response)->

  if response.statusCode is 200
    paletteData = ''

    response.on 'data', (chunk)->
      paletteData += chunk

    response.on 'end', ->
      palette = {}

      palette = JSON.parse(paletteData)[0]

      if (typeof palette) isnt 'undefined'
        Palette.setAuthor palette.userName
        Palette.setTitle palette.title
        Palette.setUrl palette.url

        colorsCallback palette.colors

      else
        console.log 'ERROR: No matching palette was found'

colorsCallback = (colors)->

  if (Object.prototype.toString.call colors) is '[object Array]'

    Palette.setTotalColors colors.length

    for color in colors

      options =
        hostname : Palette.getHost()
        path : "/api/color/#{color}?format=json"

      request = http.request options, (response)->
        colorData = ''

        response.on 'data', (chunk)->
          colorData += chunk

        response.on 'end', ->
          color = JSON.parse(colorData)[0]
          title = color.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()
          title = "$#{title}:"
          hex = '#' + color.hex
          rgb = "rgb(#{color.rgb.red},#{color.rgb.green},#{color.rgb.blue})"

          Palette.addColor title, hex, rgb

          Palette.incrementCount()

          count = Palette.getCount()
          total = Palette.getTotalColors()

          if count is total
            Palette.writeFile()

      .end()

  else

    console.log 'ERROR: Palette does not contain any colors!'

parameterize = (parameter)->

  option = /^--(file|format)=(.*)/.exec parameter

  if option?

    switch option[1]

      when 'file'
        if option[2]?
          Palette.setFile option[2]
      when 'format'
        if option[2]?
          Palette.setFormat option[2]

###
# The handling of the ID parameter is done outside of parameterize() to
# ensure that it is not executed more than once
###

idflag = /^(--id=)(.*)/

if parameters.length > 0

  hasID = false
  id = null

  for i in [0...parameters.length]

    result = idflag.exec parameters[i]

    if result?
      hasID = true
      id = result[2]
      break;

  if hasID is true and id?

    for j in [0...parameters.length]

      parameterize parameters[j]

    options =
      hostname : Palette.getHost()
      path : "/api/palette/#{id}/?format=json"

    request = http.request options, paletteCallback
    request.end()

  else

    console.log 'ERROR: No palette ID has been provided'

else

  console.log 'ERROR: No palette ID has been provided'