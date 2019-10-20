/* eslint-disable */

module.exports = {
	entry: './src/index.ts',
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
					},
				],
			},
		],
	},
	resolve: {
		extensions: [ '*', '.js', '.jsx', '.ts', '.tsx' ],
	},
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM',
	},
};
