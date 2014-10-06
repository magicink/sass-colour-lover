'#! /usr/bin/env node';

/*
 * Uses the COLOURLovers Palette and Color API to dynamcally generate a
 * Sass variable stylesheet.
 */
'use strict';
var fs, http, path;

http = require('http');

fs = require('fs');

path = require('path');

module.exports.SassColourLover = {};

module.exports.SassColourLover = (function() {
  function SassColourLover() {}

  SassColourLover.start = function() {
    var i, id, idFlag, j, options, request, result, _i, _j, _ref, _ref1, _results;
    idFlag = /^(--id=)(.*)/;
    if (module.exports.parameters.length > 0) {
      id = null;
      _results = [];
      for (i = _i = 0, _ref = module.exports.parameters.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        result = idFlag.exec(module.exports.parameters[i]);
        if (result != null) {
          id = result[2];
          if (id != null) {
            for (j = _j = 0, _ref1 = module.exports.parameters.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
              module.exports.Palette.parameterize(module.exports.parameters[j]);
            }
            options = {
              hostname: module.exports.Palette.getHost(),
              path: "/api/palette/" + id + "/?format=json"
            };
            request = http.request(options, function(response) {
              return module.exports.Palette.paletteCallback(response);
            });
            request.end();
          } else {
            console.log('ERROR: No palette ID has been provided');
          }
          break;
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    } else {
      return console.log('ERROR: No palette ID has been provided');
    }
  };

  return SassColourLover;

})();

module.exports.SassColourLover.parameters = process.argv.slice(2);

module.exports.Palette = {};

module.exports.Palette = (function() {
  function Palette() {}

  Palette.author = '';

  Palette.colorCount = 0;

  Palette.colors = [];

  Palette.file = '_palette.scss';

  Palette.format = 'rgb';

  Palette.hostname = 'www.colourlovers.com';

  Palette.paletteID = null;

  Palette.tabSize = 0;

  Palette.title = '';

  Palette.totalColors = 0;

  Palette.url = '';

  Palette.queried = false;

  Palette.addColor = function(title, hex, rgb) {
    title = module.exports.Palette.stripTrailingDashes(title);
    title = module.exports.Palette.individualize(title, title);
    title += ':';
    if (title.length > this.tabSize) {
      this.tabSize = title.length;
    }
    return this.colors.push({
      title: title,
      hex: hex,
      rgb: rgb
    });
  };


  /*
   * This method ensures that Sass variable names are unique.
   */

  Palette.individualize = function(title, base, count) {
    var existingColor, modifiedTitle;
    if (base == null) {
      base = '';
    }
    if (count == null) {
      count = 1;
    }
    existingColor = module.exports.Palette.getColorByTitle(title);
    if (existingColor != null) {
      modifiedTitle = "" + base + "-" + count;
      title = module.exports.Palette.individualize(modifiedTitle, base, count + 1);
    }
    return title;
  };


  /*
   * Fix titles that end in '-'
   */

  Palette.stripTrailingDashes = function(title) {
    if (title.length > 1) {
      if (title.substr(-1) === '-') {
        title = title.substr(0, title.length - 1);
        title = module.exports.Palette.stripTrailingDashes(title);
      }
    }
    return title;
  };


  /*
   * Getters
   */

  Palette.getCount = function() {
    return this.colorCount;
  };

  Palette.getHost = function() {
    return this.hostname;
  };

  Palette.getTotalColors = function() {
    return this.totalColors;
  };

  Palette.getColorByTitle = function(title) {
    var color, _i, _len, _ref;
    _ref = this.colors;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      color = _ref[_i];
      if (color.title === title) {
        return color;
      }
    }
  };


  /*
   * Setters
   */

  Palette.setAuthor = function(author) {
    this.author = author;
  };

  Palette.setFile = function(file) {
    this.file = file;
  };

  Palette.setFormat = function(format) {
    this.format = format;
  };

  Palette.setTitle = function(title) {
    this.title = title;
  };

  Palette.setTotalColors = function(totalColors) {
    this.totalColors = totalColors;
  };

  Palette.setUrl = function(url) {
    this.url = url;
  };

  Palette.incrementCount = function() {
    return this.colorCount++;
  };

  Palette.writeFile = function() {
    var buffer, bufferSize, color, output, value, _i, _len, _ref;
    output = "// Palette: " + this.title + " by " + this.author + "\r\n";
    output += "// " + this.url + "\r\n";
    output += "\r\n";
    _ref = this.colors;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      color = _ref[_i];
      output += color.title;
      bufferSize = this.tabSize - color.title.length;
      bufferSize += 4;
      buffer = Array(bufferSize).join(' ');
      output += buffer;
      value = this.format === 'hex' ? color.hex : color.rgb;
      output += value;
      output += ';\r\n';
    }
    return fs.writeFile(this.file, output, (function(_this) {
      return function(error) {
        if (error != null) {
          return console.log(error);
        } else {
          return console.log("Successfully created " + _this.file);
        }
      };
    })(this));
  };

  Palette.parameterize = function(parameter) {
    var option;
    option = /^--(file|format)=(.*)/.exec(parameter);
    if (option != null) {
      switch (option[1]) {
        case 'file':
          if (option[2] != null) {
            return module.exports.Palette.setFile(option[2]);
          }
          break;
        case 'format':
          if (option[2] != null) {
            return module.exports.Palette.setFormat(option[2]);
          }
      }
    }
  };

  Palette.paletteCallback = function(response) {
    var paletteData;
    if (response.statusCode === 200) {
      paletteData = '';
      response.on('data', function(chunk) {
        return paletteData += chunk;
      });
      return response.on('end', function() {
        var palette;
        palette = {};
        palette = JSON.parse(paletteData)[0];
        if ((typeof palette) !== 'undefined') {
          module.exports.Palette.setAuthor(palette.userName);
          module.exports.Palette.setTitle(palette.title);
          module.exports.Palette.setUrl(palette.url);
          return module.exports.Palette.colorsCallback(palette.colors);
        } else {
          return console.log('ERROR: No matching palette was found');
        }
      });
    }
  };

  Palette.colorsCallback = function(colors) {
    var color, options, request, _i, _len, _results;
    if ((Object.prototype.toString.call(colors)) === '[object Array]') {
      module.exports.Palette.setTotalColors(colors.length);
      _results = [];
      for (_i = 0, _len = colors.length; _i < _len; _i++) {
        color = colors[_i];
        options = {
          hostname: module.exports.Palette.getHost(),
          path: "/api/color/" + color + "?format=json"
        };
        _results.push(request = http.request(options, function(response) {
          var colorData;
          colorData = '';
          response.on('data', function(chunk) {
            return colorData += chunk;
          });
          return response.on('end', function() {
            var count, hex, rgb, title, total;
            color = JSON.parse(colorData)[0];
            title = color.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
            title = "$" + title;
            hex = '#' + color.hex;
            rgb = ("rgb(" + color.rgb.red + ",") + ("" + color.rgb.green + ",") + ("" + color.rgb.blue + ")");
            module.exports.Palette.addColor(title, hex, rgb);
            module.exports.Palette.incrementCount();
            count = module.exports.Palette.getCount();
            total = module.exports.Palette.getTotalColors();
            if (count === total) {
              return module.exports.Palette.writeFile();
            }
          });
        }).end());
      }
      return _results;
    } else {
      return console.log('ERROR: Palette does not contain any colors!');
    }
  };

  return Palette;

})();
