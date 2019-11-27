import React, { useState } from 'react';
import {
	ColorInputRoot,
	ColorValueDisplay,
	ColorButtonContainer,
	ColorButton,
	InputContainer,
	Input,
} from './styled';
import { isValidHex } from '../../utility/color-utility';

export interface ColorInputProps {
	onChange: (value: string) => void;
	presetColors: string[];
	value?: string;
	defaultValue?: string;
}

const ColorInput: React.FunctionComponent<ColorInputProps> = ({
	value: controlledValue,
	defaultValue,
	presetColors,
	onChange,
}) => {
	const [ stateValue, setStateValue ] = useState(controlledValue || defaultValue || '');
	const [ inputValue, setInputValue ] = useState(controlledValue || defaultValue || '');

	const value = controlledValue || stateValue;

	return (
		<ColorInputRoot>
			<ColorValueDisplay color={value}>
				<p>{value}</p>
			</ColorValueDisplay>
			<ColorButtonContainer>
				{presetColors.map((color) => (
					<ColorButton
						color={color}
						isSelected={color === value}
						onClick={() => {
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
					onBlur={() => {
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
