import React, { useState } from 'react';
import styled from 'styled-components';
import { SetStyleContextCallback } from '../../types/callbacks/SetStyleContextCallback';
import StyleContext from '../../types/context/StyleContext';
import ColorInput from '../color-input/ColorInput';

export const PopoverContentWrapper = styled.div`
	background-color: #F8F8F8;
	border-radius: 4px;
	z-index: 10px;
`;

export interface StyleControlsProps {
	setStyleContext: SetStyleContextCallback;
	styleContext: StyleContext;
}

export const StyleControlPopover: React.FunctionComponent<StyleControlsProps> = () => {
	const [ selectedColor, setSelectedColor ] = useState('#697689');

	return (
		<PopoverContentWrapper>
			<ColorInput
				presetColors={[
					'#F47373',
					'#697689',
					'#37D67A',
					'#2CCCE4',
					'#555555',
					'#DCE775',
					'#FF8A65',
					'#BA68C8',
				]}
				value={selectedColor}
				onChange={(value): void => setSelectedColor(value)}
			/>
		</PopoverContentWrapper>
	);
};
