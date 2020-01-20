import React from 'react';
import styled from 'styled-components';
import { PropertyList } from './types';
import {
	CodeSnippet,
	PropertyNameLink,
	PropertyName,
	PropertyType,
} from './styled';
import links from './interface-links';

const SubsectionHeader = styled.h4`
	margin: 5px 0;
`;

const ParamList = styled.ul`
	margin: 0;
`;

const FunctionContainer = styled.div`
	margin: 42px 0;
`;

const FunctionDescription = styled.p`
	margin: 6px;
`;

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
		{meta.map(({ name, parameters, description }) => (
			<FunctionContainer>
				<CodeSnippet id={name}>
					<PropertyNameLink isMethod id={name} href={`#${name}`}>{name}</PropertyNameLink>({parameters && Object.entries(parameters).map(([ param, property ], index, arr) => (
						<span>
							<PropertyName isMethod={property.type === 'callback'}>{param}</PropertyName>:{' '}
							<PropertyType link={links[property.type]}>{property.type}</PropertyType>{property.isArray && '[]'}{index !== arr.length - 1 && ', '}
						</span>
					))})
				</CodeSnippet>
				<FunctionDescription>{description}</FunctionDescription>
				{parameters && (
					<>
						<SubsectionHeader>Parameters</SubsectionHeader>
						<ParamList>
							{Object.entries(parameters).map(([ param, property ]) => (
								<li>
									<i>{param}</i>{property.description && `: ${property.description}`}
								</li>
							))}
						</ParamList>
					</>
				)}
			</FunctionContainer>
		))}
	</>
);
