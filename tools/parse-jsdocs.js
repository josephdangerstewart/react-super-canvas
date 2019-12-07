/* eslint-disable */

const TypeDoc = require('typedoc');
const fs = require('fs');
const path = require('path');

const app = new TypeDoc.Application({
	ignoreCompilerErrors: true
});

if (!fs.existsSync(path.resolve('./meta'))) {
	fs.mkdirSync(path.resolve('./meta'));
}

function getTypescriptFilesFromDirectory(directory) {
	const contents = fs.readdirSync(directory);
	const files = [];

	for (const fileName of contents) {
		if (fs.lstatSync(`${directory}/${fileName}`).isDirectory()) {
			files.push(...getTypescriptFilesFromDirectory(`${directory}/${fileName}`));
			continue;
		}

		if (/\.ts$/.test(fileName)) {
			files.push(`${directory}/${fileName}`);
		}
	}

	return files;
}

const filesToScan = getTypescriptFilesFromDirectory(path.resolve('./src/types'));

const docs = app.convert(filesToScan);

for (const file of filesToScan) {
	const [, fileName] = /\/(\w*)\.ts/.exec(file);
	const reflection = docs.findReflectionByName(fileName);
	if (!reflection || reflection.kindString !== 'Interface') {
		continue;
	}

	const properties = {};
	reflection.traverse(reflection => {
		if (reflection.kindString === 'Property') {
			const commentTags = (reflection.comment && reflection.comment.tags) || [];
			const type = reflection.type && reflection.type.name;
			const inheritedFrom =
				reflection.inheritedFrom &&
				reflection.inheritedFrom.reflection &&
				reflection.inheritedFrom.reflection.parent &&
				reflection.inheritedFrom.reflection.parent.name
			
			properties[reflection.name] =  {
				...commentTags.reduce((total, current) => ({ ...total, [current.tagName]: current.text }), {}),
				type,
				inheritedFrom,
			}
		}
	});

	if (Object.keys(properties).some(Boolean)) {
		if (!fs.existsSync(path.resolve('./meta/interfaces'))) {
			fs.mkdirSync(path.resolve('./meta/interfaces'));
		}

		fs.writeFileSync(path.resolve(`./meta/interfaces/${fileName}.json`), JSON.stringify(properties));
	}
}
