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

interface InterfaceMetadata {
	[propertyName: string]: {
		description: string;
		default?: string;
		inheritedFrom?: string;
		isArray?: boolean;
		parameters?: InterfaceMetadata;
		returnType?: string;
		isOptional?: boolean;
		type: string;
	};
}

interface TypeDocumentationProps {
	type: string;
	parameters?: InterfaceMetadata;
	isArray?: boolean;
	returnType?: string;
}

const TypeDocumentation: React.FunctionComponent<TypeDocumentationProps> = ({
	type,
	parameters,
	isArray,
	returnType,
}) => {
	if (type === 'callback' && parameters) {
		return (
			<span>
				({parameters && Object.entries(parameters).map(([ parameter, meta ]) => (
					<span key={parameter}>
						<PropertyName isMethod={meta.type === 'callback'}>{parameter}</PropertyName>:{' '}
						<PropertyType link={links[meta.type]}>{meta.type}</PropertyType>{meta.isArray && '[]'}
					</span>
				)).reduce((prev, cur) => ([ ...prev, ', ', cur ]), []).splice(1)}) <Keyword>=&gt;</Keyword> <PropertyType>{returnType}</PropertyType>
			</span>
		);
	}

	return (
		<span>
			<PropertyType link={links[type]}>{type}</PropertyType>{isArray && '[]'}
		</span>
	);
};

export interface InterfaceDocumentationProps {
	interfaceMetadata: InterfaceMetadata;
	hideInheritedMembers?: boolean;
}

export const InterfaceDocumentation: React.FunctionComponent<InterfaceDocumentationProps> = ({
	interfaceMetadata,
	hideInheritedMembers,
}) => {
	const properties = Object.keys(interfaceMetadata);

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
				} = interfaceMetadata[key];

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
		</CodeSnippet>
	);
};
