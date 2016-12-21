'use strict';

var TTFToWOFF = require('ttf2woff');

module.exports = function (ttfBuffer) {
  return new Promise(function (resolve) {
    var font = TTFToWOFF(new Uint8Array(ttfBuffer));
    resolve(new Buffer(font.buffer));
  });
};