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
	...getTypescriptFilesFromDirectory(path.resolve('./src/components')),
	...getTypescriptFilesFromDirectory(path.resolve('./src/utility')),
	path.resolve('./src/types/IBrush.ts'),
];

const docs = app.convert(filesToScan);

const reflections = docs
	.files
	.reduce((total, file) => [...total, ...file.reflections], []);

const interfaces = reflections.filter(reflection => reflection && reflection.kindString === 'Interface');
const callbacks = reflections
	.filter(reflection =>
		reflection &&
		reflection.signatures &&
		reflection.sources.find(source => /types\/callbacks\//.test(source.file.fullFileName))
	)
	.map(reflection => reflection.signatures)
	.reduce((all, signatures) => [...all, ...signatures], [])
	.reduce((map, signature) => {
		const [,fileName] = /\/([^\/]*)\.tsx?/.exec(signature.sources[0] && signature.sources[0].fileName) || [];
		if (fileName) {
			map[fileName] = signature;
		}
		return map;
	}, {});

const utilityMethodsByUtility = reflections
	.filter(reflection =>
		reflection &&
		reflection.sources.find(source => /src\/utility\//.test(source.file.fullFileName)) &&
		reflection.kind === TypeDoc.ReflectionKind.Function
	)
	.reduce((all, reflection) => {
		const [,fileName] = /(.*)\.tsx?/.exec(reflection.sources[0].file.name);

		if (!all[fileName]) {
			all[fileName] = [];
		}

		all[fileName].push(reflection);

		return all;
	}, {});

const getType = (type) => {
	if (!type) {
		return {};
	}

	let typeArgumentsObj = {};
	if (type.typeArguments) {
		typeArgumentsObj = {
			typeArguments: type.typeArguments.map(getType),
		}
	}

	if (type.type === 'union') {
		return {
			...typeArgumentsObj,
			typeUnion: type.types.map(getType),
		}
	}

	if (callbacks[type.name]) {
		const signature = callbacks[type.name];
		const returnType = getType(signature.type);
		const parameters = {};
		for (const parameter of signature.parameters || []) {
			parameters[parameter.name] = buildMetaForProperty(parameter);
		}
		return {
			...typeArgumentsObj,
			parameters,
			returnType,
			type: 'callback',
		}
	}

	if (type.type === 'array') {
		return {
			...typeArgumentsObj,
			type: type.elementType.name,
			isArray: true,
		}
	}

	if (type.type === 'reflection' && type.declaration) {
		const parameters = {};
		const returnTypes = [];
		for (const signature of type.declaration.signatures || []) {
			if (signature.kindString === 'Call signature') {
				returnTypes.push(getType(signature.type));
				for (const parameter of signature.parameters || []) {
					parameters[parameter.name] = buildMetaForProperty(parameter);
				}
			}
		}

		return {
			...typeArgumentsObj,
			parameters,
			returnType: returnTypes[0],
			type: 'callback',
		}
	}

	return {
		...typeArgumentsObj,
		type: type.name,
	}
};

const buildMetaForProperty = (reflection) => {
	const commentTags = (reflection.comment && reflection.comment.tags) || [];
	const inheritedFrom =
		reflection.inheritedFrom &&
		reflection.inheritedFrom.reflection &&
		reflection.inheritedFrom.reflection.parent &&
		reflection.inheritedFrom.reflection.parent.name;

	const isOptional = reflection.flags && reflection.flags.isOptional;

	let typeObj = {};
	if (reflection.type) {
		typeObj = getType(reflection.type);
	}
	
	return {
		...commentTags.reduce((total, current) => ({ ...total, [current.tagName]: current.text }), {}),
		...typeObj,
		inheritedFrom,
		isOptional,
	}
}

const getIndexSignatures = (indexSignature) => {
	const parameters = indexSignature.parameters && indexSignature.parameters.map(r => ({
		...buildMetaForProperty(r),
		name: r.name
	}));

	const type = getType(indexSignature.type);

	return {
		parameters,
		type,
	};
}

function buildMetaForFunction(reflection) {
	const commentTags = ((reflection.comment || reflection.signatures[0].comment || {}).tags || [])
		.reduce((total, current) => ({ ...total, [current.tagName]: current.text }), {});

	const parameters = {};
	for (const parameter of reflection.signatures[0].parameters || []) {
		parameters[parameter.name] = buildMetaForProperty(parameter);
		parameters[parameter.name].description = parameter.comment && parameter.comment.text;
	}

	return {
		name: reflection.name,
		description: commentTags.description,
		isTested: Boolean(commentTags.tested),
		untestedReason: commentTags.untested,
		parameters,
	};
}

for (const reflection of interfaces) {
	const meta = {};
	reflection.traverse(r => {
		if (r.kindString === 'Property') {
			if (!meta.properties) {
				meta.properties = {};
			}

			meta.properties[r.name] = buildMetaForProperty(r);
		}
	});

	if (reflection.indexSignature) {
		meta.indexSignature = getIndexSignatures(reflection.indexSignature);
	}

	if (Object.keys(meta).some(Boolean)) {
		if (!fs.existsSync(path.resolve('./meta/interfaces'))) {
			fs.mkdirSync(path.resolve('./meta/interfaces'));
		}

		fs.writeFileSync(path.resolve(`./meta/interfaces/${reflection.name}.json`), JSON.stringify(meta));
	}
}

for (const utilityFile in utilityMethodsByUtility) {
	const utilityMeta = utilityMethodsByUtility[utilityFile].map(buildMetaForFunction);

	if (!fs.existsSync(path.resolve('./meta/utility'))) {
		fs.mkdirSync(path.resolve('./meta/utility'));
	}

	fs.writeFileSync(path.resolve(`./meta/utility/${utilityFile}.json`), JSON.stringify(utilityMeta));
}
