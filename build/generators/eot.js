'use strict';

var TTFToEOT = require('ttf2eot');

module.exports = function (ttfBuffer) {
  return new Promise(function (resolve) {
    var font = TTFToEOT(new Uint8Array(ttfBuffer));
    resolve(new Buffer(font.buffer));
  });
};