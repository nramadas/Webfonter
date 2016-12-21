var webpack = require("webpack");
var path = require("path");

var compiler = webpack({
  entry: './webfonter.js',
  output: {
    path: path.join(__dirname),
    filename: "index.js",
    library: "index.js",
    libraryTarget: "umd",
  },
  resolve: {
    extensions: ['', '.js'],
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: [
            'es2015',
            'stage-2',
          ]
        },
      },
    ],
  },
  externals: {
    'yargs': 'commonjs yargs',
    'fs': 'commonjs fs',
    'crypto': 'commonjs crypto',
  },
});

compiler.run(function(err, stats) {
  console.log(stats.toString({
    colors: false,
    chunks: false,
    version: false,
  }));
});
