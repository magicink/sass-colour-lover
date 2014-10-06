#! /usr/bin/env node
"use strict";

var fs, http, i, id, idFlag, j, options, parameters, path, request, result, _i, _j, _ref, _ref1;

if (http = require("http"), fs = require("fs"), path = require("path"), module.exports.Palette = {}, 
module.exports.Palette = function() {
    function Palette() {}
    return Palette.author = "", Palette.colorCount = 0, Palette.colors = [], Palette.file = "_palette.scss", 
    Palette.format = "rgb", Palette.hostname = "www.colourlovers.com", Palette.paletteID = null, 
    Palette.tabSize = 0, Palette.title = "", Palette.totalColors = 0, Palette.url = "", 
    Palette.queried = !1, Palette.addColor = function(title, hex, rgb) {
        return title = module.exports.Palette.stripTrailingDashes(title), title = module.exports.Palette.individualize(title, title), 
        title += ":", title.length > this.tabSize && (this.tabSize = title.length), this.colors.push({
            title: title,
            hex: hex,
            rgb: rgb
        });
    }, Palette.individualize = function(title, base, count) {
        var existingColor, modifiedTitle;
        return null == base && (base = ""), null == count && (count = 1), existingColor = module.exports.Palette.getColorByTitle(title), 
        null != existingColor && (modifiedTitle = "" + base + "-" + count, title = module.exports.Palette.individualize(modifiedTitle, base, count + 1)), 
        title;
    }, Palette.stripTrailingDashes = function(title) {
        return title.length > 1 && "-" === title.substr(-1) && (title = title.substr(0, title.length - 1), 
        title = module.exports.Palette.stripTrailingDashes(title)), title;
    }, Palette.getCount = function() {
        return this.colorCount;
    }, Palette.getHost = function() {
        return this.hostname;
    }, Palette.getTotalColors = function() {
        return this.totalColors;
    }, Palette.getColorByTitle = function(title) {
        var color, _i, _len, _ref;
        for (_ref = this.colors, _i = 0, _len = _ref.length; _len > _i; _i++) if (color = _ref[_i], 
        color.title === title) return color;
    }, Palette.setAuthor = function(author) {
        this.author = author;
    }, Palette.setFile = function(file) {
        this.file = file;
    }, Palette.setFormat = function(format) {
        this.format = format;
    }, Palette.setTitle = function(title) {
        this.title = title;
    }, Palette.setTotalColors = function(totalColors) {
        this.totalColors = totalColors;
    }, Palette.setUrl = function(url) {
        this.url = url;
    }, Palette.incrementCount = function() {
        return this.colorCount++;
    }, Palette.writeFile = function() {
        var buffer, bufferSize, color, output, value, _i, _len, _ref;
        for (output = "// Palette: " + this.title + " by " + this.author + "\r\n", output += "// " + this.url + "\r\n", 
        output += "\r\n", _ref = this.colors, _i = 0, _len = _ref.length; _len > _i; _i++) color = _ref[_i], 
        output += color.title, bufferSize = this.tabSize - color.title.length, bufferSize += 4, 
        buffer = Array(bufferSize).join(" "), output += buffer, value = "hex" === this.format ? color.hex : color.rgb, 
        output += value, output += ";\r\n";
        return fs.writeFile(this.file, output, function(_this) {
            return function(error) {
                return console.log(null != error ? error : "Successfully created " + _this.file);
            };
        }(this));
    }, Palette.parameterize = function(parameter) {
        var option;
        if (option = /^--(file|format)=(.*)/.exec(parameter), null != option) switch (option[1]) {
          case "file":
            if (null != option[2]) return module.exports.Palette.setFile(option[2]);
            break;

          case "format":
            if (null != option[2]) return module.exports.Palette.setFormat(option[2]);
        }
    }, Palette.paletteCallback = function(response) {
        var paletteData;
        return 200 === response.statusCode ? (paletteData = "", response.on("data", function(chunk) {
            return paletteData += chunk;
        }), response.on("end", function() {
            var palette;
            return palette = {}, palette = JSON.parse(paletteData)[0], "undefined" != typeof palette ? (module.exports.Palette.setAuthor(palette.userName), 
            module.exports.Palette.setTitle(palette.title), module.exports.Palette.setUrl(palette.url), 
            module.exports.Palette.colorsCallback(palette.colors)) : console.log("ERROR: No matching palette was found");
        })) : void 0;
    }, Palette.colorsCallback = function(colors) {
        var color, options, request, _i, _len, _results;
        if ("[object Array]" === Object.prototype.toString.call(colors)) {
            for (module.exports.Palette.setTotalColors(colors.length), _results = [], _i = 0, 
            _len = colors.length; _len > _i; _i++) color = colors[_i], options = {
                hostname: module.exports.Palette.getHost(),
                path: "/api/color/" + color + "?format=json"
            }, _results.push(request = http.request(options, function(response) {
                var colorData;
                return colorData = "", response.on("data", function(chunk) {
                    return colorData += chunk;
                }), response.on("end", function() {
                    var count, hex, rgb, title, total;
                    return color = JSON.parse(colorData)[0], title = color.title.replace(/[^a-z0-9]/gi, "-").toLowerCase(), 
                    title = "$" + title, hex = "#" + color.hex, rgb = "rgb(" + color.rgb.red + "," + ("" + color.rgb.green + ",") + ("" + color.rgb.blue + ")"), 
                    module.exports.Palette.addColor(title, hex, rgb), module.exports.Palette.incrementCount(), 
                    count = module.exports.Palette.getCount(), total = module.exports.Palette.getTotalColors(), 
                    count === total ? module.exports.Palette.writeFile() : void 0;
                });
            }).end());
            return _results;
        }
        return console.log("ERROR: Palette does not contain any colors!");
    }, Palette;
}(), parameters = process.argv.slice(2), idFlag = /^(--id=)(.*)/, parameters.length > 0) {
    for (id = null, i = _i = 0, _ref = parameters.length; _ref >= 0 ? _ref > _i : _i > _ref; i = _ref >= 0 ? ++_i : --_i) if (result = idFlag.exec(parameters[i]), 
    null != result) {
        if (id = result[2], null != id) {
            for (j = _j = 0, _ref1 = parameters.length; _ref1 >= 0 ? _ref1 > _j : _j > _ref1; j = _ref1 >= 0 ? ++_j : --_j) module.exports.Palette.parameterize(parameters[j]);
            options = {
                hostname: module.exports.Palette.getHost(),
                path: "/api/palette/" + id + "/?format=json"
            }, request = http.request(options, function(response) {
                return module.exports.Palette.paletteCallback(response);
            }), request.end();
        } else console.log("ERROR: No palette ID has been provided");
        break;
    }
} else console.log("ERROR: No palette ID has been provided");