#!/usr/bin/env node
require('babel-polyfill');
const yargs = require('yargs');
const fs = require('fs');
const crypto = require('crypto');

const createSvgSheet = require('./generators/svgSheet');
const createTTF = require('./generators/ttf');
const createWOFF = require('./generators/woff');
const createEOT = require('./generators/eot');
const createCSS = require('./generators/css');
const createHTML = require('./generators/html');

const options = yargs
  .demand(['f', 'd'])
  .alias('f', 'files')
    .describe('f', 'path to directory containing svgs that will be converted to fonts')
  .alias('d', 'dest')
    .describe('d', 'path to the directory the resulting files should be dropped into')
  .alias('n', 'name')
    .describe('n', 'name of the font')
    .default('n', 'font')
  .alias('c', 'cssUrl')
    .describe('c', 'path to the font files that should be used in the css file')
  .argv;

const zip = (a, b) => a.map((x, i) => [x, b[i]]);

const writeFontFile = (file, ext, hash) => {
  const fileName = options.name + '.' + hash + '.' + ext;
  fs.writeFileSync(options.dest + '/' + fileName, file);
  return fileName;
};

const writeFile = (file, ext) => {
  const fileName = options.name + '.' + ext;
  fs.writeFileSync(options.dest + '/' + fileName, file);
  return fileName;
};

createSvgSheet(options.files, options.name)
  .then(({ glyphToCodepoint, svgSheet }) => {
    return Promise.all([
      Promise.resolve({ glyphToCodepoint }),
      Promise.resolve(svgSheet),
      createTTF(svgSheet),
    ]);
  })
  .then(data => {
    const [metaData, svg, ttf] = data;

    return Promise.all([
      Promise.resolve(metaData),
      Promise.resolve(svg),
      Promise.resolve(ttf),
      createWOFF(ttf),
      createEOT(ttf),
    ]);
  })
  .then(data => {
    const metaData = data[0];
    const fontFiles = data.slice(1);
    const extensions = ['svg', 'ttf', 'woff', 'eot'];

    const hasher = crypto.createHash('md5');
    fontFiles.forEach(file => hasher.update(file));
    const hash = hasher.digest('hex');

    return {
      metaData,
      fileNames: zip(fontFiles, extensions)
        .map(([file, extension]) => writeFontFile(file, extension, hash))
        .sort(),
    };
  })
  .then(({ metaData, fileNames }) => {
    const css = createCSS(options.name, fileNames, options.cssUrl || options.dest, metaData.glyphToCodepoint);
    const html = createHTML(options.name, options.dest, metaData.glyphToCodepoint, css);
    writeFile(css, 'css');
    writeFile(html, 'html');
    return;
  })
  .catch(e => console.log(e));
