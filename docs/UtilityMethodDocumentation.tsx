import React, { useState } from 'react';
import styled from 'styled-components';
import { PropertyList } from './types';
import {
	CodeSnippet,
	PropertyNameLink,
	PropertyName,
	PropertyType,
} from './styled';
import links from './interface-links';

const INITIAL_UNTESTED_LIMIT = 3;

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

const ExpandToggle = styled(Anchor)`
	cursor: pointer;
	font-style: italic;
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
	const [ isExpanded, setIsExpanded ] = useState(false);
	const untestedFunctions = meta.filter(({ isTested, untestedReason }) => !isTested && !untestedReason);
	const testCoverage = 100 - Math.floor((untestedFunctions.length / meta.length) * 100);

	return (
		<>
			<p>
				Test coverage (tested an explicitly untested functions): <strong>{testCoverage}%</strong>
			</p>
			{untestedFunctions.length > 0 && (
				<>
					<p>Untested Functions</p>
					<ul>
						{untestedFunctions.slice(0, INITIAL_UNTESTED_LIMIT + 1).map(({ name }) => (
							<li><Anchor href={`#${name}`}>{name}</Anchor></li>
						))}
						{untestedFunctions.length > INITIAL_UNTESTED_LIMIT && (
							isExpanded
								? untestedFunctions.slice(INITIAL_UNTESTED_LIMIT + 1).map(({ name }) => (
									<li><Anchor href={`#${name}`}>{name}</Anchor></li>
								)).concat((
									<li><ExpandToggle onClick={() => setIsExpanded(false)}>Hide {untestedFunctions.length - INITIAL_UNTESTED_LIMIT}.</ExpandToggle></li>
								))
								: (
									<li><ExpandToggle onClick={() => setIsExpanded(true)}>See {untestedFunctions.length - INITIAL_UNTESTED_LIMIT} more.</ExpandToggle></li>
								)
						)}
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
