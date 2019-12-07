import React from 'react';
import styled from 'styled-components';
// eslint-disable-next-line import/no-extraneous-dependencies
import ReactMarkdown from 'react-markdown';

const colorsForTypes: { [key: string]: string } = {
	string: '#CE9178',
	nullish: '#569CD6',
	number: '#7FB347',
};

const CodeSnippet = styled.div`
	background-color: #1E1E1E;
	margin-bottom: 5px;
	padding: 8px;
	font-family: monospace;
	color: #D4D4D4;
	font-size: 16px;
	border-radius: 6px;
`;

const Property = styled.p`
	margin: 12px 0;
`;

const PropertyName = styled.span`
	color: #9CDCFE;
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

const PropertyType = styled.span`
	color: #4EC9B0;
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
		type: string;
	};
}

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
				} = interfaceMetadata[key];

				const typeForDefault = [ 'null', 'undefined' ].includes((defaultValue || '').trim()) ? 'nullish' : type;
				if (hideInheritedMembers && inheritedFrom) {
					return null;
				}

				return (
					<Property>
						<PropertyName>{key}</PropertyName>{defaultValue && '?'}: <PropertyType>{type}</PropertyType>{isArray && '[]'}
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
