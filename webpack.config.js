var webpack = require('webpack');

module.exports = {
    module: {
        loaders: [
		{
			test: /\.ts$/,
			loader: 'ts'
		}
        ]
    },
    entry: "./fe/scripts/app.ts",
    output: {
        path: "./fe/scripts/",
        filename: "app.js"
    }
};