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

		if (/\.tsx?$/.test(fileName)) {
			files.push(`${directory}/${fileName}`);
		}
	}

	return files;
}

const filesToScan = [
	...getTypescriptFilesFromDirectory(path.resolve('./src/types')),
];

const docs = app.convert(filesToScan);

const reflections = docs
	.files
	.reduce((total, file) => [...total, ...file.reflections], []);

const interfaces = reflections.filter(reflection => reflection && reflection.kindString === 'Interface');
const callbacks = reflections
	.filter(reflection =>
		reflection &&
		reflection.kindString === 'Type literal' &&
		reflection.sources.find(source => /types\/callbacks\//.test(source.fileName))
	)
	.map(reflection => reflection.signatures)
	.reduce((all, signatures) => [...all, ...signatures], [])
	.reduce((map, signature) => {
		const [,fileName] = /\/(\w*).tsx?/.exec(signature.sources[0] && signature.sources[0].fileName) || [];
		if (fileName) {
			map[fileName] = signature;
		}
		return map;
	}, {});

const buildProperties = (reflection) => {
	const commentTags = (reflection.comment && reflection.comment.tags) || [];
	const inheritedFrom =
		reflection.inheritedFrom &&
		reflection.inheritedFrom.reflection &&
		reflection.inheritedFrom.reflection.parent &&
		reflection.inheritedFrom.reflection.parent.name;

	const isOptional = reflection.flags && reflection.flags.isOptional;

	let type;
	let typeFlags = {};
	if (reflection.type) {
		if (callbacks[reflection.type.name]) {
			type = 'callback';
			const signature = callbacks[reflection.type.name];
			const returnType = signature.type.name;
			const parameters = {};
			for (const parameter of signature.parameters || []) {
				parameters[parameter.name] = buildProperties(parameter);
			}
			typeFlags.parameters = parameters;
			typeFlags.returnType = returnType;
		} else if (reflection.type.type === 'array') {
			type = reflection.type.elementType.name;
			typeFlags.isArray = true;
		} else if (reflection.type.type === 'reflection' && reflection.type.declaration) {
			type = 'callback';
			const parameters = {};
			const returnTypes = []
			for (const signature of reflection.type.declaration.signatures || []) {
				if (signature.kindString === 'Call signature') {
					returnTypes.push(signature.type.name);
					for (const parameter of signature.parameters || []) {
						parameters[parameter.name] = buildProperties(parameter);
					}
				}
			}
			typeFlags.parameters = parameters;
			typeFlags.returnType = returnTypes[0];
		} else {
			type = reflection.type.name;
		}
	}
	
	return {
		...commentTags.reduce((total, current) => ({ ...total, [current.tagName]: current.text }), {}),
		...typeFlags,
		type,
		inheritedFrom,
		isOptional,
	}
}

for (const reflection of interfaces) {
	const properties = {};
	reflection.traverse(reflection => {
		if (reflection.kindString === 'Property') {
			properties[reflection.name] = buildProperties(reflection);
		}
	});

	if (Object.keys(properties).some(Boolean)) {
		if (!fs.existsSync(path.resolve('./meta/interfaces'))) {
			fs.mkdirSync(path.resolve('./meta/interfaces'));
		}

		fs.writeFileSync(path.resolve(`./meta/interfaces/${reflection.name}.json`), JSON.stringify(properties));
	}
}
