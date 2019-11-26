import styled from 'styled-components';
import styles from '../global-styles';
import { getContrast, ColorContrast } from '../../utility/color-utility';

export const ColorInputRoot = styled.div`
	background-color: ${styles.background.white};
	border-radius: 10px;
	width: 170px;
`;

export interface ColorValueDisplayProps {
	color: string;
}

export const ColorValueDisplay = styled.div<ColorValueDisplayProps>`
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: ${(props): string => props.color};
	color: ${(props): string => props.color && getContrast(props.color) === ColorContrast.Dark ? 'white' : 'black'};
	width: 100%;
	height: 110px;
`;

export const ColorButtonContainer = styled.div`
	padding: 8px 16px;
	display: inline-block;
`;

export interface ColorButtonProps {
	color: string;
	isSelected: boolean;
}

export const ColorButton = styled.div<ColorButtonProps>`
	border-radius: 50%;
	background-color: ${(props): string => props.color};
	display: inline-block;
	width: 22px;
	height: 22px;
	margin: 5px;
	cursor: pointer;
	transition: box-shadow .2s;
	box-shadow: ${(props): string => props.isSelected ? '0px 0px 2px 1px rgba(0,0,0,0.37)' : ''};

	&:hover {
		box-shadow: 0px 0px 2px 1px rgba(0,0,0,0.37);
	}
`;

export const InputContainer = styled.div`
	padding: 0 16px 8px;
	display: flex;
	justify-content: center;
`;

export const Input = styled.input`
	width: 100%;
	border: 0px;
	box-shadow: rgb(221, 221, 221) 0px 0px 0px 1px inset;
	padding: 2px 4px;
`;
