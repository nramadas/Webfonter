#!/usr/bin/env node
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

require('babel-polyfill');
var yargs = require('yargs');
var fs = require('fs-extra');
var crypto = require('crypto');
var path = require('path');

var createSvgSheet = require('./generators/svgSheet');
var createTTF = require('./generators/ttf');
var createWOFF = require('./generators/woff');
var createEOT = require('./generators/eot');
var createCSS = require('./generators/css');
var createHTML = require('./generators/html');

var options = yargs.demand(['f', 'd']).alias('f', 'files').describe('f', 'path to directory containing svgs that will be converted to fonts').alias('d', 'dest').describe('d', 'path to the directory the resulting files should be dropped into').alias('n', 'name').describe('n', 'name of the font').default('n', 'font').alias('c', 'cssUrl').describe('c', 'path to the font files that should be used in the css file').argv;

var zip = function zip(a, b) {
  return a.map(function (x, i) {
    return [x, b[i]];
  });
};

var writeFontFile = function writeFontFile(file, ext, hash) {
  var fileName = options.name + '.' + hash + '.' + ext;
  fs.outputFileSync(path.resolve(options.dest + '/' + fileName), file);
  return fileName;
};

var writeFile = function writeFile(file, ext) {
  var fileName = options.name + '.' + ext;
  fs.outputFileSync(path.resolve(options.dest + '/' + fileName), file);
  return fileName;
};

createSvgSheet(options.files, options.name).then(function (_ref) {
  var glyphToCodepoint = _ref.glyphToCodepoint,
      svgSheet = _ref.svgSheet;

  return Promise.all([Promise.resolve({ glyphToCodepoint: glyphToCodepoint }), Promise.resolve(svgSheet), createTTF(svgSheet)]);
}).then(function (data) {
  var _data = _slicedToArray(data, 3),
      metaData = _data[0],
      svg = _data[1],
      ttf = _data[2];

  return Promise.all([Promise.resolve(metaData), Promise.resolve(svg), Promise.resolve(ttf), createWOFF(ttf), createEOT(ttf)]);
}).then(function (data) {
  var metaData = data[0];
  var fontFiles = data.slice(1);
  var extensions = ['svg', 'ttf', 'woff', 'eot'];

  var hasher = crypto.createHash('md5');
  fontFiles.forEach(function (file) {
    return hasher.update(file);
  });
  var hash = hasher.digest('hex');

  return {
    metaData: metaData,
    fileNames: zip(fontFiles, extensions).map(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          file = _ref3[0],
          extension = _ref3[1];

      return writeFontFile(file, extension, hash);
    }).sort()
  };
}).then(function (_ref4) {
  var metaData = _ref4.metaData,
      fileNames = _ref4.fileNames;

  var css = createCSS(options.name, fileNames, options.cssUrl || options.dest, metaData.glyphToCodepoint);
  var html = createHTML(options.name, options.dest, metaData.glyphToCodepoint, css);
  writeFile(css, 'css');
  writeFile(html, 'html');
  return;
}).catch(function (e) {
  return console.log(e);
});