const svgSheetToTTF = require('svg2ttf');

module.exports = fontSheet => new Promise(resolve => {
  const font = svgSheetToTTF(fontSheet);
  resolve(new Buffer(font.buffer));
});
