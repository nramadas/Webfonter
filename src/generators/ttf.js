const svgSheetToTTF = require('svg2ttf');

module.exports = fontSheet => new Promise(resolve => {
  const font = svgSheetToTTF(fontSheet);
  resolve(Buffer.from(font.buffer));
});
