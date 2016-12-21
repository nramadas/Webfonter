module.exports = (fontName, destination, glyphs, css) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${fontName} | Preview</title>
        <style>
          body {
            font-family: sans-serif;
            margin: 0;
            padding: 20px;
          }

          .preview {
            line-height: 2em;
          }

          .preview__icon {
            display: inline-block;
            width: 32px;
            text-align: center;
          }

          .icon {
            display: inline-block;
            vertical-align: middle;
            font-size: 16px;
          }

          ${css
            .replace(new RegExp(destination, 'g'), '.')
            .split('\n')
            .map(l => `          ${l}`)
            .join('\n')}
        </style>
      </head>
      <body>
        <h1>${fontName} - Preview</h1>
        ${Object
          .keys(glyphs)
          .map(name => `
            <div class='preview'>
              <span class='preview__icon'>
                <span class='icon icon-${name}'></span>
              </span>
              <span>${name}</span>
            </div>
          `)
          .join('')}
      </body>
    </html>
  `
  .split('\n')
  .map(line => line.replace('    ', ''))
  .join('\n');
};
