'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

module.exports = function (fontName, fileNames, destination, glyphs) {
  var _fileNames$map = fileNames.map(function (f) {
    return 'url("' + destination + '/' + f + '")';
  }),
      _fileNames$map2 = _slicedToArray(_fileNames$map, 4),
      eot = _fileNames$map2[0],
      svg = _fileNames$map2[1],
      ttf = _fileNames$map2[2],
      woff = _fileNames$map2[3];

  return ('\n    @font-face {\n      font-family: "' + fontName + '";\n      src: ' + eot + ',\n           ' + woff + ',\n           ' + ttf + ',\n           ' + svg + ';\n    }\n\n    .icon:before {\n      font-family: "' + fontName + '";\n    }\n    ' + Object.keys(glyphs).map(function (k) {
    return ('\n        .icon-' + k + ':before {\n          content: "\\' + glyphs[k].toString(16) + '"\n        }').replace(new RegExp('        ', 'g'), '');
  }).join('') + '\n  ').split('\n').map(function (line) {
    return line.replace('    ', '');
  }).join('\n');
};