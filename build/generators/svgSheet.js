'use strict';

var svgToSheet = require('svgicons2svgfont');
var fs = require('fs');
var path = require('path');

var SVG_SHEET_OPTIONS = {
  normalize: true,
  fontHeight: 1000
};

var STARTING_CODEPOINT = 0xF101;

module.exports = function (fileDirectory, fontName) {
  return new Promise(function (resolve) {
    var files = fs.readdirSync(fileDirectory).filter(function (fileName) {
      return ~fileName.indexOf('.svg');
    }).sort();

    var glyphToCodepoint = files.reduce(function (prev, fileName, i) {
      prev[fileName.replace('.svg', '')] = STARTING_CODEPOINT + i;
      return prev;
    }, {});

    var fontsSheet = new Buffer(0);
    var streamOptions = Object.assign({}, SVG_SHEET_OPTIONS, { fontName: fontName });

    var fontStream = new svgToSheet(streamOptions).on('data', function (data) {
      fontsSheet = Buffer.concat([fontsSheet, data]);
    }).on('end', function () {
      return resolve({ glyphToCodepoint: glyphToCodepoint, svgSheet: fontsSheet.toString() });
    });

    files.forEach(function (fileName, index) {
      var filePath = path.resolve(process.cwd(), fileDirectory + '/' + fileName);
      var glyph = fs.createReadStream(filePath);
      var unicode = String.fromCharCode(glyphToCodepoint[fileName.replace('.svg', '')]);
      glyph.metadata = { name: fileName.replace('.svg', ''), unicode: [unicode] };
      fontStream.write(glyph);
    });

    fontStream.end();
  });
};