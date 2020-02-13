/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactMarkdown from 'react-markdown';
import links from './interface-links';
import {
	PropertyName,
	Keyword,
	CodeSnippet,
	Property,
	PropertyDefault,
	PropertyDescription,
	PropertyType,
} from './styled';

import { TypedProperty, InterfaceMetadata, IndexSignature } from './types';

const intersperse = (arr: React.ReactNode[], separator: React.ReactNode): React.ReactNode[] => [].concat(
	...arr.map((el) => [ separator, el ]),
).splice(1);

const TypeDocumentation: React.FunctionComponent<TypedProperty> = ({
	type,
	parameters,
	isArray,
	returnType,
	typeArguments,
	typeUnion,
}) => {
	if (type === 'callback') {
		return (
			<span>
				({parameters && Object.entries(parameters).map(([ parameter, meta ]) => (
					<span key={parameter}>
						<PropertyName isMethod={meta.type === 'callback'}>{parameter}</PropertyName>:{' '}
						<TypeDocumentation {...meta} />{meta.isArray && '[]'}
					</span>
				)).reduce((prev, cur) => ([ ...prev, ', ', cur ]), []).splice(1)}) <Keyword>=&gt;</Keyword>&nbsp;
				<TypeDocumentation
					{...returnType}
				/>
			</span>
		);
	}

	if (typeUnion) {
		return (
			<span>
				{intersperse(
					typeUnion.map((uType) => <TypeDocumentation {...uType} />),
					<span>&nbsp;|&nbsp;</span>,
				)}
			</span>
		);
	}

	return (
		<span>
			<PropertyType link={links[type]}>{type}</PropertyType>{isArray && '[]'}{
				typeArguments && (
					<span>
						{'<'}
						{intersperse(
							typeArguments.map((typeArgument) => <TypeDocumentation {...typeArgument} />),
							<span>,&nbsp;</span>,
						)}{'>'}
					</span>
				)
			}
		</span>
	);
};

const IndexSignatureDocumentation: React.FunctionComponent<{ signature: IndexSignature }> = ({
	signature,
}) => {
	const {
		name,
		isOptional,
		isArray,
		type,
		parameters,
		returnType,
		typeUnion,
		typeArguments,
	} = signature.parameters[0] || {};

	return (
		<Property>
			[<PropertyName>{name}</PropertyName>{isOptional ? '?' : ''}:&nbsp;
			<TypeDocumentation
				isArray={isArray}
				type={type}
				parameters={parameters}
				returnType={returnType}
				typeUnion={typeUnion}
				typeArguments={typeArguments}
			/>]: <TypeDocumentation {...signature.type} />
		</Property>
	);
};

export interface InterfaceDocumentationProps {
	interfaceMetadata: InterfaceMetadata;
	hideInheritedMembers?: boolean;
	showIndexSignature?: boolean;
}

export const InterfaceDocumentation: React.FunctionComponent<InterfaceDocumentationProps> = ({
	interfaceMetadata = {},
	hideInheritedMembers,
	showIndexSignature,
}) => {
	const properties = Object.keys(interfaceMetadata.properties || {});
	const { indexSignature } = interfaceMetadata;

	return (
		<CodeSnippet>
			{properties.map((key) => {
				const {
					description,
					default: defaultValue,
					type,
					inheritedFrom,
					isArray,
					parameters,
					returnType,
					isOptional,
					typeUnion,
					typeArguments,
				} = interfaceMetadata.properties[key];

				const typeForDefault = [ 'null', 'undefined' ].includes((defaultValue || '').trim()) ? 'nullish' : type;
				if (hideInheritedMembers && inheritedFrom) {
					return null;
				}

				return (
					<Property key={key}>
						<PropertyName isMethod={type === 'callback'}>{key}</PropertyName>{isOptional && '?'}:&nbsp;
						<TypeDocumentation
							isArray={isArray}
							type={type}
							parameters={parameters}
							returnType={returnType}
							typeUnion={typeUnion}
							typeArguments={typeArguments}
						/>
						{defaultValue && (
							<>
								&nbsp;-&nbsp;
								<PropertyDefault type={typeForDefault}>{defaultValue}</PropertyDefault>
							</>
						)}
						<br />
						<PropertyDescription><ReactMarkdown source={description} /></PropertyDescription>
					</Property>
				);
			})}
			{indexSignature && showIndexSignature && (
				<IndexSignatureDocumentation signature={indexSignature} />
			)}
		</CodeSnippet>
	);
};
