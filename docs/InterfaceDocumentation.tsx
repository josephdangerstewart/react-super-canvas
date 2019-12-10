import React from 'react';
import styled from 'styled-components';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactMarkdown from 'react-markdown';
import links from './interface-links';

const colorsForTypes: { [key: string]: string } = {
	string: '#CE9178',
	nullish: '#569CD6',
	number: '#7FB347',
};

const Keyword = styled.span`
	color: ${colorsForTypes.nullish};
`;

const CodeSnippet = styled.div`
	background-color: #1E1E1E;
	margin-bottom: 5px;
	padding: 8px;
	font-family: monospace;
	color: #D4D4D4;
	font-size: 16px;
	border-radius: 6px;
`;

const Property = styled.div`
	margin: 12px 0;
`;

const PropertyName = styled.span<{ isMethod: boolean }>`
	color: ${({ isMethod }): string => isMethod ? '#DCDCAA' : '#9CDCFE'};
`;

const PropertyDescription = styled.div`
	font-size: 14px;
	margin: 0 0 0 12px;

	p {
		margin: 0;
	}

	a {
		color: #D4D4D4;

		&:hover {
			color: #1E1E1E;
			background-color: #D4D4D4;
		}
	}
`;

const PropertyTypeStyled = styled.span`
	color: #4EC9B0;

	a {
		color: #4EC9B0;
		text-decoration: unset;

		&:hover {
			background-color: #4EC9B0;
			color: #1E1E1E;
		}
	}
`;

const PropertyDefault = styled.i<{ type: string }>`
	color: ${({ type }): string => colorsForTypes[type] || 'inherit'};
`;

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

const PropertyType: React.FunctionComponent<{ link?: string }> = ({ link, children }) => {
	if (link) {
		return (
			<PropertyTypeStyled>
				<a href={link}>{children}</a>
			</PropertyTypeStyled>
		);
	}

	return (
		<PropertyTypeStyled>
			{children}
		</PropertyTypeStyled>
	);
};

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
