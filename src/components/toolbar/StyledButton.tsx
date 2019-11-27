import styled from 'styled-components';

export interface ToggleButtonProps {
	toggled: boolean;
}

export const ToggleButton = styled.button<ToggleButtonProps>`
	/* Reset the styles */
	background: none;
	border: 0;
	cursor: pointer;
	color: ${(props): string => props.toggled ? 'black' : '#BBBBBB'};

	&:hover {
		${(props): string => props.toggled ? '' : 'color: #8C8C8C;'}
	}

	&:focus {
		outline: none;
	}
`;

export interface ButtonProps {
	backgroundColor?: string;
}

export const Button = styled.button<ButtonProps>`
	background: none;
	border: 0;
	cursor: pointer;
	color: black;
	${(props): string => props.backgroundColor ? `background-color: ${props.backgroundColor}` : ''}

	&:hover {
		color: #8C8C8C;
	}

	&:focus {
		outline: none;
	}

	&:active {
		color: #BBBBBB;
	}
`;
