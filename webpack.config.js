const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/periodic-table.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'app/www')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
};
