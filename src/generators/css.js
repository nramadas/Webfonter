module.exports = (fontName, fileNames, destination, glyphs) => {
  const [eot, svg, ttf, woff] = fileNames.map(f => `url("${destination}/${f}")`);

  return `
    @font-face {
      font-family: "${fontName}";
      src: ${eot},
           ${woff},
           ${ttf},
           ${svg};
    }

    .icon:before {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-family: "${fontName}";
    }
    ${Object
      .keys(glyphs)
      .map(k => `
        .icon-${k}:before {
          content: "\\${glyphs[k].toString(16)}"
        }`.replace(new RegExp('        ', 'g'), ''))
      .join('')}
  `
  .split('\n')
  .map(line => line.replace('    ', ''))
  .join('\n');
}
