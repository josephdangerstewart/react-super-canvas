import React from 'react';
import { PropertyList } from './types';
import { CodeSnippet, PropertyName, PropertyType } from './styled';
import links from './interface-links';

interface UtilityMethodMetadata {
	name: string;
	description: string;
	isTested: boolean;
	untestedReason: string;
	parameters?: PropertyList;
}

interface UtilityMethodDocumentationProps {
	meta: UtilityMethodMetadata[];
}

export const UtilityMethodDocumentation: React.FunctionComponent<UtilityMethodDocumentationProps> = ({
	meta,
}) => (
	<>
		{meta.map(({ name, parameters }) => (
			<CodeSnippet>
				<PropertyName isMethod>{name}</PropertyName>({parameters && Object.entries(parameters).map(([ param, property ], index, arr) => (
					<span>
						<PropertyName isMethod={property.type === 'callback'}>{param}</PropertyName>:{' '}
						<PropertyType link={links[property.type]}>{property.type}</PropertyType>{property.isArray && '[]'}{index !== arr.length - 1 && ', '}
					</span>
				))})
			</CodeSnippet>
		))}
	</>
);
