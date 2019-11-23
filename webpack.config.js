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
			{
				test: /\.less$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: true,
							localIdentName: '[local]___[hash:base64:5]'
						}
					},
					{
						loader: 'less-loader'
					}
				]
			}
		],
	},
	resolve: {
		extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
	},
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM',
	},
};
