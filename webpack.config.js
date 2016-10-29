module.exports = {
  entry: './app/app.jsx',
  output: {
    path: './public',
    filename: 'bundle.js'
  },
  resolve: {
    root: __dirname,
    alias: {
    },
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        },
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/
      },
      {
       test: /\.scss$/,
       loaders: ["style", "css", "sass"]
     }
    ]
  },
};
