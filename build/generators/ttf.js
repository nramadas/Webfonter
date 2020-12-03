'use strict';

var svgSheetToTTF = require('svg2ttf');

module.exports = function (fontSheet) {
  return new Promise(function (resolve) {
    var font = svgSheetToTTF(fontSheet);
    resolve(Buffer.from(font.buffer));
  });
};