const TTFToWOFF = require('ttf2woff');

module.exports = ttfBuffer => new Promise(resolve => {
  const font = TTFToWOFF(new Uint8Array(ttfBuffer));
  resolve(Buffer.from(font.buffer));
});
