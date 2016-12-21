'use strict';

module.exports = function (fontName, destination, glyphs, css) {
  return ('\n    <!DOCTYPE html>\n    <html lang="en">\n      <head>\n        <meta charset="UTF-8">\n        <title>' + fontName + ' | Preview</title>\n        <style>\n          body {\n            font-family: sans-serif;\n            margin: 0;\n            padding: 20px;\n          }\n\n          .preview {\n            line-height: 2em;\n          }\n\n          .preview__icon {\n            display: inline-block;\n            width: 32px;\n            text-align: center;\n          }\n\n          .icon {\n            display: inline-block;\n            vertical-align: middle;\n            font-size: 16px;\n          }\n\n          ' + css.replace(new RegExp(destination, 'g'), '.').split('\n').map(function (l) {
    return '          ' + l;
  }).join('\n') + '\n        </style>\n      </head>\n      <body>\n        <h1>' + fontName + ' - Preview</h1>\n        ' + Object.keys(glyphs).map(function (name) {
    return '\n            <div class=\'preview\'>\n              <span class=\'preview__icon\'>\n                <span class=\'icon icon-' + name + '\'></span>\n              </span>\n              <span>' + name + '</span>\n            </div>\n          ';
  }).join('') + '\n      </body>\n    </html>\n  ').split('\n').map(function (line) {
    return line.replace('    ', '');
  }).join('\n');
};