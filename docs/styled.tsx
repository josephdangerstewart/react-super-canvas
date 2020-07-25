import React from 'react';
import styled from 'styled-components';

const colorsForTypes: { [key: string]: string } = {
	string: '#CE9178',
	nullish: '#569CD6',
	number: '#7FB347',
};

export const Keyword = styled.span`
	color: ${colorsForTypes.nullish};
`;

export const CodeSnippet = styled.div`
	background-color: #1E1E1E;
	margin-bottom: 5px;
	padding: 8px;
	font-family: monospace;
	color: #D4D4D4;
	font-size: 16px;
	border-radius: 6px;
	flex-grow: 1;
`;

export const Property = styled.div<{ verticalMargin?: number }>`
	margin: ${({ verticalMargin }) => verticalMargin ?? 12}px 0;
`;

export const PropertyName = styled.span<{ isMethod?: boolean }>`
	color: ${({ isMethod }): string => isMethod ? '#DCDCAA' : '#9CDCFE'};
`;

export const PropertyNameLink = styled.a<{ isMethod: boolean }>`
	color: ${({ isMethod }): string => isMethod ? '#DCDCAA' : '#9CDCFE'};
	text-decoration: unset;

	&:hover {
		background-color: ${({ isMethod }): string => isMethod ? '#DCDCAA' : '#9CDCFE'};
		color: #1E1E1E;
	}
`;

export const PropertyDescription = styled.div`
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

export const PropertyTypeStyled = styled.span`
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

export const PropertyDefault = styled.i<{ type: string }>`
	color: ${({ type }): string => colorsForTypes[type] || 'inherit'};
`;

export const PropertyType: React.FunctionComponent<{ link?: string }> = ({ link, children }) => {
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
