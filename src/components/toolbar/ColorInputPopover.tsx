import React, { useState } from 'react';
import styled from 'styled-components';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popover from 'react-tiny-popover';
import { SetStyleContextCallback } from '../../types/callbacks/SetStyleContextCallback';
import StyleContext from '../../types/context/StyleContext';
import ColorInput from '../color-input/ColorInput';
import { Button } from './StyledButton';

export const PopoverContentWrapper = styled.div`
	background-color: #F8F8F8;
	border-radius: 4px;
	z-index: 10px;
`;

export interface ColorInputPopoverProps {
	setStyleContext: SetStyleContextCallback;
	styleContext: StyleContext;
	icon: IconDefinition;
	styleContextKey: keyof StyleContext;
	canClear?: boolean;
}

const ColorInputPopover: React.FunctionComponent<ColorInputPopoverProps> = ({
	icon,
	styleContext,
	styleContextKey,
	setStyleContext,
	canClear,
}) => {
	const [ isOpen, setIsOpen ] = useState(false);
	const selectedColor = styleContext[styleContextKey] as string;

	return (
		<Popover
			isOpen={isOpen}
			content={(
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
						onChange={(value): void => {
							setStyleContext({ [styleContextKey]: value });
						}}
						canClear={canClear}
					/>
				</PopoverContentWrapper>
			)}
			onClickOutside={(): void => setIsOpen(false)}
			position="bottom"
		>
			<Button onClick={(): void => setIsOpen(!isOpen)} highlightColor={selectedColor}>
				<FontAwesomeIcon icon={icon} />
			</Button>
		</Popover>
	);
};

export default ColorInputPopover;
