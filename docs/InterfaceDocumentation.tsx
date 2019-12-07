import React from 'react';
import styled from 'styled-components';

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

const PropertyDescription = styled.p`
	font-size: 14px;
	margin: 0 0 0 12px;
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
		type: string;
	};
}

export interface InterfaceDocumentationProps {
	interfaceMetadata: InterfaceMetadata;
}

export const InterfaceDocumentation: React.FunctionComponent<InterfaceDocumentationProps> = ({
	interfaceMetadata,
}) => {
	const properties = Object.keys(interfaceMetadata);

	return (
		<CodeSnippet>
			{properties.map((key) => {
				const { description, default: defaultValue, type } = interfaceMetadata[key];
				const typeForDefault = [ 'null', 'undefined' ].includes((defaultValue || '').trim()) ? 'nullish' : type;

				return (
					<Property>
						<PropertyName>{key}</PropertyName>{defaultValue && '?'}: <PropertyType>{type}</PropertyType>
						{defaultValue && (
							<>
								&nbsp;-&nbsp;
								<PropertyDefault type={typeForDefault}>{defaultValue}</PropertyDefault>
							</>
						)}
						<br />
						<PropertyDescription>{description}</PropertyDescription>
					</Property>
				);
			})}
		</CodeSnippet>
	);
};
