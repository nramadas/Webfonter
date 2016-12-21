const svgToSheet = require('svgicons2svgfont');
const fs = require('fs');
const path = require('path');

const SVG_SHEET_OPTIONS = {
  normalize: true,
};

const STARTING_CODEPOINT = 0xF101;

module.exports = (fileDirectory, fontName) => new Promise(resolve => {
  const files = fs
    .readdirSync(fileDirectory)
    .filter(fileName => ~fileName.indexOf('.svg'))
    .sort();

  const glyphToCodepoint = files.reduce((prev, fileName, i) => {
    prev[fileName.replace('.svg', '')] = STARTING_CODEPOINT + i;
    return prev;
  }, {});


  let fontsSheet = new Buffer(0);
  const streamOptions = Object.assign({}, SVG_SHEET_OPTIONS, { fontName });

  const fontStream = svgToSheet(streamOptions)
    .on('data', data => { fontsSheet = Buffer.concat([fontsSheet, data]); })
    .on('end', () => resolve({ glyphToCodepoint, svgSheet: fontsSheet.toString() }));

  files.forEach((fileName, index) => {
    const filePath = path.resolve(process.cwd(), fileDirectory + '/' + fileName);
    const glyph = fs.createReadStream(filePath);
    const unicode = String.fromCharCode(glyphToCodepoint[fileName.replace('.svg', '')]);
    glyph.metadata = { name: fileName.replace('.svg', ''), unicode: [unicode] };
    fontStream.write(glyph);
  });

  fontStream.end();
});
