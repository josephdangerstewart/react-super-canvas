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

const Anchor = styled.a`
	color: var(--theme-ui-colors-primary,#0B5FFF);
	text-decoration: none;

	&:hover {
		text-decoration: underline;
	}
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
}) => {
	const untestedFunctions = meta.filter(({ isTested, untestedReason }) => !isTested && !untestedReason);
	const testCoverage = 100 - Math.floor((untestedFunctions.length / meta.length) * 100);

	return (
		<>
			<p>
				Test coverage (tested an explicitly untested functions): <strong>{testCoverage}%</strong>
			</p>
			{untestedFunctions.length && (
				<>
					<p>Untested Functions</p>
					<ul>
						{untestedFunctions.map(({ name }) => (
							<li><Anchor href={`#${name}`}>{name}</Anchor></li>
						))}
					</ul>
				</>
			)}
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
};
