const TTFToEOT = require('ttf2eot');

module.exports = ttfBuffer => new Promise(resolve => {
  const font = TTFToEOT(new Uint8Array(ttfBuffer));
  resolve(Buffer.from(font.buffer));
});
