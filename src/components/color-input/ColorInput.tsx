import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import {
	ColorInputRoot,
	ColorValueDisplay,
	ColorButtonContainer,
	ColorButton,
	InputContainer,
	Input,
	ClearButton,
} from './styled';
import { isValidHex } from '../../utility/color-utility';

const Italics = styled.span`
	font-style: italic;
`;

export interface ColorInputProps {
	onChange: (value: string) => void;
	presetColors: string[];
	value?: string;
	defaultValue?: string;
	canClear?: boolean;
}

const ColorInput: React.FunctionComponent<ColorInputProps> = ({
	value: controlledValue,
	defaultValue,
	presetColors,
	onChange,
	canClear,
}) => {
	const [ stateValue, setStateValue ] = useState(controlledValue || defaultValue || '');
	const [ inputValue, setInputValue ] = useState(controlledValue || defaultValue || '');

	const value = controlledValue || stateValue;

	return (
		<ColorInputRoot>
			<ColorValueDisplay color={value}>
				<p>{value || <Italics>NA</Italics>}</p>
				{value && canClear && (
					<ClearButton
						onClick={(): void => {
							setInputValue('');
							setStateValue(null);
							onChange(null);
						}}
					>
						<FontAwesomeIcon icon={faTimesCircle} />
					</ClearButton>
				)}
			</ColorValueDisplay>
			<ColorButtonContainer>
				{presetColors.map((color) => (
					<ColorButton
						color={color}
						isSelected={color === value}
						onClick={(): void => {
							setInputValue(color);
							setStateValue(color);
							onChange(color);
						}}
					/>
				))}
			</ColorButtonContainer>
			<InputContainer>
				<Input
					onChange={(event): void => {
						const newValue = event.target.value;

						setInputValue(newValue);
						if (isValidHex(newValue)) {
							setStateValue(newValue);
							onChange(newValue);
						}
					}}
					value={inputValue}
					onBlur={(): void => {
						if (!isValidHex(inputValue)) {
							setInputValue(stateValue);
						}
					}}
				/>
			</InputContainer>
		</ColorInputRoot>
	);
};

export default ColorInput;
