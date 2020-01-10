module.exports = {
	preset: 'ts-jest/presets/js-with-ts',
	testEnvironment: 'node',
	testRegex: './tests/.*.(js|ts|tsx|jsx)$',
	testPathIgnorePatterns: [
		'/node_modules/',
		'<rootDir>/tests/test-utils',
	],
};
