import styled from 'styled-components';

export interface ToggleButtonProps {
	toggled: boolean;
}

export const ToggleButton = styled.button<ToggleButtonProps>`
	/* Reset the styles */
	background: none;
	border: 0;
	cursor: pointer;
	padding: 0;
	margin: 1px 6px;
	color: ${(props): string => props.toggled ? 'black' : '#BBBBBB'};

	&:hover {
		${(props): string => props.toggled ? '' : 'color: #8C8C8C;'}
	}

	&:focus {
		outline: none;
	}
`;

export interface ButtonProps {
	highlightColor?: string;
}

export const Button = styled.button<ButtonProps>`
	background: none;
	border: 0;
	cursor: pointer;
	padding: 0;
	margin: 1px 6px;
	color: black;
	position: relative;

	&:hover {
		color: #8C8C8C;
	}

	&:focus {
		outline: none;
	}

	&:active {
		color: #BBBBBB;
	}

	&:after {
		content: '';
		position: absolute;
		width: 100%;
		height: 2px;
		bottom: -2px;
		left: 0;
		${(props): string => !props.highlightColor ? 'display: none' : ''}
		${(props): string => props.highlightColor ? `background-color: ${props.highlightColor}` : ''}
	}
`;
